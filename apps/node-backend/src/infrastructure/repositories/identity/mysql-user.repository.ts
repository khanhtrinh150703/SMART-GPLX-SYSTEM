import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  IUserRecord,
  PrismaUserWithRoles,
} from "@/infrastructure/persistence/identity/user.record";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/i-master-data-cache.service";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { UserRelatedCount } from "@/shared/types/count.types";
import { STATUS } from "@/shared/config/status.config";

/**
 * @interface IMySQLUserRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho User Repository.
 * Chỉ cho phép tiếp cận PrismaClient để thực hiện các thao tác với bảng Users.
 */
export interface IMySQLUserRepositoryCradle {
  prisma: PrismaClient;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class MySQLUserRepository
 * @description Triển khai Repository cho Người dùng sử dụng MySQL và Prisma ORM.
 * Quản lý các thông tin định danh, hồ sơ và trạng thái tài khoản.
 */
export class MySQLUserRepository implements IUserRepository {
  private readonly _prisma: PrismaClient;
  private readonly _cacheService: IMasterDataCacheService;
  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma được "tiêm" từ DI Container.
   * @param {IMySQLUserRepositoryCradle} cradle - Chỉ chứa PrismaClient.
   */
  constructor({ prisma, masterDataCacheService }: IMySQLUserRepositoryCradle) {
    this._prisma = prisma;
    this._cacheService = masterDataCacheService;
  }

  /** @description Include roles từ bảng trung gian, map về key user_roles của IUserRecord */
  private readonly _userInclude = {
    userRoles: {
      select: { roleId: true },
    },
  };

  /**
   * Helper để map dữ liệu Prisma sang IUserRecord và chuyển về Domain Entity.
   */
  private _toDomain(raw: PrismaUserWithRoles | null): User | null {
    if (!raw) return null;

    // Map thủ công từ Prisma Object (camelCase) sang IUserRecord (snake_case)
    // để đảm bảo tính nhất quán trước khi đưa vào Mapper.
    const record: IUserRecord = {
      id: raw.id,
      username: raw.username,
      email: raw.email,
      fullName: raw.fullName, // Mapping camelCase -> snake_case
      passwordHash: raw.passwordHash,
      phoneNumber: raw.phoneNumber,
      urlPicture: raw.urlPicture,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      // Map mảng userRoles (Prisma) sang user_roles (Record)
      userRoles: raw.userRoles?.map((ur) => ({
        roleId: ur.roleId,
      })),
    };

    const roleEntities: Role[] = (raw.userRoles || []).map((ur) => {
      const cached = this._cacheService.getRoleById(ur.roleId);

      if (!cached) {
        throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR);
      }

      // Tái tạo Permission từ danh sách tên quyền trong Cache
      const permissionEntities: Permission[] = cached.permissions.map((pName) =>
        Permission.reconstitute({
          id: "N/A", // Permission trong cache thường chỉ lưu name để nhẹ
          name: pName,
          description: null,
        }),
      );

      // Tái tạo Role Entity bằng props chuẩn
      return Role.reconstitute({
        id: cached.id,
        name: cached.name,
        description: cached.description,
        permissions: permissionEntities,
      });
    });

    return UserMapper.toDomain(record, roleEntities);
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveByUsername(username: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { username, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveById(id: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveByIdentifier(identifier: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
        deletedAt: null,
      },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findExistingInSystem(email: string, username: string): Promise<User[]> {
    const raws = await this._prisma.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
      include: this._userInclude,
    });
    return raws.map((raw) => this._toDomain(raw) as User);
  }

  async findByEmailInSystem(email: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { email },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findByUsernameInSystem(username: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { username },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findByIdInSystem(id: string): Promise<User | null> {
    const raw = await this._prisma.user.findUnique({
      where: { id },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async createUser(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const raw = await this._prisma.user.create({
      data: {
        ...data,
        userRoles: {
          create: user.roles.map((role) => ({ roleId: role.id })),
        },
      },
      include: this._userInclude,
    });

    return this._toDomain(raw) as User;
  }

  public async restore(id: string): Promise<void> {
    await this._prisma.user.update({
      where: { id },
      data: { deletedAt: null, status: STATUS.ACTIVE },
    });
  }

  /**
   * @description Cập nhật thông tin User.
   * Hỗ trợ nhận vào Transaction client để đảm bảo tính nguyên tử.
   */
  public async updateUser(
    user: User,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    // 1. Chọn Client: Nếu có tx từ Service thì dùng, không thì dùng prisma mặc định
    const client = tx || this._prisma;

    const data = UserMapper.toPersistence(user);

    // 2. Thực thi Update
    const raw = await client.user.update({
      where: { id: user.id },
      data: {
        ...data,
        // Sử dụng Nested Writes của Prisma để xử lý Role
        userRoles: {
          deleteMany: {}, // Xóa hết liên kết cũ
          create: user.roles.map((role) => ({ roleId: role.id })), // Tạo liên kết mới
        },
      },
      include: this._userInclude,
    });

    return this._toDomain(raw) as User;
  }

  /**
   * @description Truy vấn danh sách người dùng có phân trang, lọc và sắp xếp.
   * @param filter DTO chứa các tham số lọc từ client.
   * @param skip Số bản ghi bỏ qua.
   * @param take Số bản ghi lấy ra.
   */
  public async findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number,
  ): Promise<[User[], number]> {
    const where: Prisma.UserWhereInput = {};

    // --- 1. LỌC THEO TRƯỜNG CỤ THỂ ---
    if (filter.name) where.fullName = { contains: filter.name };
    if (filter.email) where.email = { contains: filter.email };

    // --- 2. SEARCH TỔNG QUÁT ---
    if (filter.search) {
      const searchCondition = { contains: filter.search };
      where.OR = [
        { fullName: searchCondition },
        { email: searchCondition },
        { username: searchCondition },
      ];
    }

    // --- 3. LOGIC TRẠNG THÁI ---
    switch (filter.status) {
      case "active":
        where.deletedAt = null;
        where.status = STATUS.ACTIVE;
        break;
      case "deleted":
        where.deletedAt = { not: null };
        break;
      case "all":
        break;
      default:
        where.deletedAt = null;
        break;
    }

    // --- 4. LỌC THEO ROLE ---
    if (filter.roles) {
      where.userRoles = {
        some: {
          role: { name: { equals: filter.roles } },
        },
      };
    }

    // --- 5. XỬ LÝ SẮP XẾP (GOM NHÓM & TIÊN QUYẾT) ---
    const fieldMapping: Record<string, string> = {
      name: "fullName",
      email: "email",
      username: "username",
      status: "status",
      createdAt: "createdAt",
    };

    const sortBy = filter.sortBy || "createdAt";
    const sortOrder = filter.sortOrder || "desc";
    const mappedField = fieldMapping[sortBy] || "createdAt";

    // Khởi tạo mảng orderBy để gom nhóm
    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

    // Ưu tiên 1: Gom nhóm theo ngày xóa (deletedAt)
    // Giúp tách biệt "Thùng rác" và "Hiện hành"
    orderBy.push({ deletedAt: sortOrder });

    // Ưu tiên 2: Gom nhóm theo trạng thái chuỗi (status)
    // Giúp nhóm các account 'active', 'inactive', 'locked' lại với nhau
    if (mappedField !== "status") {
      orderBy.push({ status: sortOrder });
    }

    // Ưu tiên 3: Tiêu chí người dùng chọn từ UI (sortBy)
    if (mappedField !== "deletedAt" && mappedField !== "status") {
      orderBy.push({
        [mappedField]: sortOrder,
      } as Prisma.UserOrderByWithRelationInput);
    }

    // Ưu tiên 4: Tie-breaker (Phân xử bằng Tên hoặc ID)
    if (mappedField !== "fullName") {
      orderBy.push({ fullName: "asc" });
    }

    // --- 6. THỰC THI TRUY VẤN ---
    const [rawUsers, total] = await this._prisma.$transaction([
      this._prisma.user.findMany({
        where,
        include: this._userInclude,
        skip,
        take,
        orderBy, // Sử dụng mảng gom nhóm vừa build
      }),
      this._prisma.user.count({ where }),
    ]);

    // --- 7. MAPPING ---
    const users = rawUsers
      .map((raw) => this._toDomain(raw))
      .filter((user): user is User => user !== null);

    return [users, total];
  }

  /**
   * @description Thực hiện xóa logic (Soft Delete) tài khoản người dùng bằng cách đánh dấu thời gian xóa.
   * @param {string} id - Định danh duy nhất của người dùng cần xử lý. (User's unique identifier).
   * @returns {Promise<void>}
   * @principle Data Retention - Giữ lại thông tin để phục vụ Audit Log hoặc tuân thủ chính sách lưu trữ dữ liệu người dùng. (Retaining info for auditing or data retention policies).
   */
  public async softDelete(id: string): Promise<void> {
    await this._prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: STATUS.DELETED,
      },
    });
  }

  /**
   * @description Thực hiện xóa vật lý (Hard Delete) - loại bỏ vĩnh viễn tài khoản và dữ liệu liên quan khỏi hệ thống.
   * @param {string} id - Định danh duy nhất của người dùng. (User's unique identifier).
   * @returns {Promise<void>}
   * @warning Irreversible - Thao tác này sẽ xóa sạch dữ liệu cá nhân, không thể khôi phục và có thể ảnh hưởng đến dữ liệu lịch sử thi. (This action is irreversible and permanent).
   */
  public async hardDelete(id: string): Promise<void> {
    await this._prisma.user.delete({
      where: { id },
    });
  }

  /**
   * @description Thống kê các thành phần phụ thuộc của tài khoản người dùng (User) trước khi xóa.
   * @param {string} id - Định danh UUID của người dùng.
   * @returns {Promise<UserRelatedCount>} Thống kê số lượng bản ghi liên quan ở các phân hệ.
   */
  public async countRelatedData(id: string): Promise<UserRelatedCount> {
    // Sử dụng Promise.all để chạy song song các truy vấn đếm, tối ưu hiệu năng DB
    const [rolesCount, topicStatsCount, progressCount, rankCount, examCount] =
      await Promise.all([
        this._prisma.userRole.count({ where: { userId: id } }),
        this._prisma.userTopicStatistics.count({ where: { userId: id } }),
        this._prisma.userQuestionProgress.count({ where: { userId: id } }),
        this._prisma.userExamRank.count({ where: { userId: id } }),
        this._prisma.exam.count({ where: { userId: id } }),
      ]);

    return {
      userRoles: rolesCount,
      userTopicStats: topicStatsCount,
      userQuestionProgress: progressCount,
      userExamRank: rankCount,
      userExam: examCount,
    };
  }
}
