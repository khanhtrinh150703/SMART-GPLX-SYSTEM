import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { Prisma } from "@prisma/client";
import {
  IUserRecord,
  PrismaUserWithRoles,
} from "@/infrastructure/persistence/identity/user.record";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { UserRelatedCount } from "@/shared/types/count.types";
import { STATUS } from "@/shared/config/status.config";
import { IUnitOfWork } from "@/domain/interfaces/seedwork";

/**
 * @interface IMySQLUserRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho User Repository qua Awilix Proxy.
 * Đảm bảo tính đóng gói bằng cách loại bỏ hoàn toàn PrismaClient thô, mọi tác vụ DB bắt buộc đi qua Unit of Work.
 */
export interface IMySQLUserRepositoryCradle {
  unitOfWork: IUnitOfWork;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class MySQLUserRepository
 * @description Triển khai Repository cho Người dùng sử dụng MySQL thông qua điều phối của PrismaUnitOfWork.
 * Quản lý các thông tin định danh, hồ sơ, trạng thái tài khoản và tuân thủ nghiêm ngặt Zero-Any Architecture.
 */
export class MySQLUserRepository implements IUserRepository {
  private readonly _uow: IUnitOfWork;
  private readonly _cacheService: IMasterDataCacheService;

  /**
   * @description Khởi tạo Repository với sự cô lập hạ tầng dữ liệu tối đa.
   * @param {IMYSQLUserRepositoryCradle} cradle - Thùng chứa phụ thuộc được tiêm tự động từ DI Container.
   */
  constructor({
    unitOfWork,
    masterDataCacheService,
  }: IMySQLUserRepositoryCradle) {
    this._uow = unitOfWork;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description ĐÂY CHÍNH LÀ CHÌA KHÓA: Khai báo thuộc tính "client" động.
   * Mỗi khi trong hàm gọi "this.client", nó sẽ tự chạy lệnh lấy client mới nhất từ UoW.
   */
  private get client(): Prisma.TransactionClient {
    return this._uow.getContext() as Prisma.TransactionClient;
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
    const raw = await this.client.user.findFirst({
      where: { email, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveByUsername(username: string): Promise<User | null> {
    const raw = await this.client.user.findFirst({
      where: { username, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveById(id: string): Promise<User | null> {
    const raw = await this.client.user.findFirst({
      where: { id, deletedAt: null },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findActiveByIdentifier(identifier: string): Promise<User | null> {
    const raw = await this.client.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
        deletedAt: null,
      },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findExistingInSystem(email: string, username: string): Promise<User[]> {
    const raws = await this.client.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
      include: this._userInclude,
    });
    return raws.map((raw) => this._toDomain(raw) as User);
  }

  async findByEmailInSystem(email: string): Promise<User | null> {
    const raw = await this.client.user.findFirst({
      where: { email },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findByUsernameInSystem(username: string): Promise<User | null> {
    const raw = await this.client.user.findFirst({
      where: { username },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async findByIdInSystem(id: string): Promise<User | null> {
    const raw = await this.client.user.findUnique({
      where: { id },
      include: this._userInclude,
    });
    return this._toDomain(raw);
  }

  async createUser(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const raw = await this.client.user.create({
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

  public async restore(id: string): Promise<User | null> {
    const record = await this.client.user.update({
      where: { id },
      data: { deletedAt: null, status: STATUS.ACTIVE },
      include: this._userInclude,
    });
    return this._toDomain(record);
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
    const client = tx || this.client;

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
    const [rawUsers, total] = await Promise.all([
      this.client.user.findMany({
        where,
        include: this._userInclude,
        skip,
        take,
        orderBy, // Sử dụng mảng gom nhóm vừa được tính toán
      }),
      this.client.user.count({ where }),
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
    await this.client.user.update({
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
    await this.client.user.delete({
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
        this.client.userRole.count({ where: { userId: id } }),
        this.client.userTopicStatistics.count({ where: { userId: id } }),
        this.client.userQuestionProgress.count({ where: { userId: id } }),
        this.client.userExamRank.count({ where: { userId: id } }),
        this.client.exam.count({ where: { userId: id } }),
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
