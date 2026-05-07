import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  IUserRecord,
  PrismaUserWithRoles,
} from "@/infrastructure/persistence/identity/user.record";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { Permission } from "@/domain/entities/permission/permission.entity";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { UserRelatedCount } from "@/shared/types/count.types";

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

  async findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number,
  ): Promise<[User[], number]> {
    const where: Prisma.UserWhereInput = {};

    // --- 1. MAPPING: Định nghĩa "bản đồ" ánh xạ từ FE sang BE ---
    // Việc này giúp ép kiểu chính xác mà không cần dùng any
    const fieldMapping: Record<string, keyof Prisma.UserWhereInput> = {
      name: "fullName",
      fullName: "fullName",
      email: "email",
      username: "username",
    };

    // Xác định field thực tế trong DB dựa trên sortBy từ FE
    // Nếu FE gửi 'name', dbField sẽ là 'fullName'. Nếu không khớp thì mặc định 'fullName'
    const dbField = fieldMapping[filter.sortBy as string] || "fullName";
    const searchValue = filter.name;

    // --- 2. DYNAMIC SEARCH: Sort đâu - Search đó ---
    if (searchValue) {
      // Chỉ search nếu dbField là những cột có kiểu chuỗi (String)
      if (
        dbField === "fullName" ||
        dbField === "email" ||
        dbField === "username"
      ) {
        where[dbField] = { contains: searchValue };
      }
    }

    // --- 3. LOGIC TRẠNG THÁI (Status Tabs) ---
    if (filter.status === "active") {
      where.deletedAt = null;
      where.status = "active";
    } else if (filter.status === "deleted") {
      where.deletedAt = { not: null };
    } else if (filter.status === "all") {
      // Admin xem hết
    } else {
      where.deletedAt = null;
    }

    // --- 4. LỌC THEO ROLE ---
    if (filter.roles) {
      where.userRoles = {
        some: {
          role: { name: { equals: filter.roles } },
        },
      };
    }

    // --- 5. SEARCH TỔNG QUÁT (Ô tìm kiếm chung) ---
    if (filter.search) {
      where.OR = [
        { fullName: { contains: filter.search } },
        { email: { contains: filter.search } },
        { username: { contains: filter.search } },
      ];
    }

    // --- 6. XỬ LÝ SORT FIELD (Cho orderBy) ---
    // Tái sử dụng dbField ở trên, nhưng xử lý riêng trường hợp status
    const finalSortField =
      filter.sortBy === "status" ? "deletedAt" : (dbField as string);
    const sortOrder = filter.sortOrder || "desc";

    // --- 7. THỰC THI TRUY VẤN ---
    const [rawUsers, total] = await this._prisma.$transaction([
      this._prisma.user.findMany({
        where,
        include: this._userInclude,
        skip,
        take,
        orderBy: [
          {
            [finalSortField]: sortOrder,
          },
          {
            id: "desc",
          },
        ],
      }),
      this._prisma.user.count({ where }),
    ]);

    return [rawUsers.map((raw) => this._toDomain(raw) as User), total];
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
        status: "DELETED",
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
   * @description Thống kê các thành phần phụ thuộc của tài khoản người dùng (User) để đánh giá mức độ ảnh hưởng trước khi thực hiện thao tác xóa.
   * @param {string} id - Định danh duy nhất (UUID) của người dùng. (Unique identifier of the user).
   * @returns {Promise<UserRelatedCount>} Đối tượng chứa số lượng các vai trò (roles) đang được gán cho người dùng này. (Object containing counts of assigned user roles).
   * @note Do cơ chế 'onDelete: Cascade' trong DB, việc xóa User sẽ xóa sạch các bản ghi gán vai trò (UserRole). Hàm này giúp Service đưa ra quyết định: Nếu người dùng đã được gán roles, ưu tiên Soft Delete để giữ lại lịch sử phân quyền và tra soát (Audit). (Due to Cascade Delete, this helper ensures the Service chooses Soft Delete over Hard Delete for data safety and auditing).
   */
  public async countRelatedData(id: string): Promise<UserRelatedCount> {
    const rolesCount = await this._prisma.userRole.count({
      where: { userId: id },
    });

    return {
      userRoles: rolesCount,
    };
  }
}
