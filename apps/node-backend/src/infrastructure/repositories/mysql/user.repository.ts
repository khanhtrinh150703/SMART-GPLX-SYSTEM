import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { IUserRecord, PrismaUserWithRoles } from "@/infrastructure/persistence/user.record";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";

/**
 * @interface IMySQLUserRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho User Repository.
 * Chỉ cho phép tiếp cận PrismaClient để thực hiện các thao tác với bảng Users.
 */
export interface IMySQLUserRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLUserRepository
 * @description Triển khai Repository cho Người dùng sử dụng MySQL và Prisma ORM.
 * Quản lý các thông tin định danh, hồ sơ và trạng thái tài khoản.
 */
export class MySQLUserRepository implements IUserRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma được "tiêm" từ DI Container.
   * @param {IMySQLUserRepositoryCradle} cradle - Chỉ chứa PrismaClient.
   */
  constructor({ prisma }: IMySQLUserRepositoryCradle) {
    this._prisma = prisma;
  }
  /** @description Include roles từ bảng trung gian, map về key user_roles của IUserRecord */
  private readonly _userInclude = {
    userRoles: {
      select: { roleId: true }
    }
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
        roleId: ur.roleId
      }))
    };

    return UserMapper.toDomain(record);
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findActiveByUsername(username: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { username, deletedAt: null },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findActiveById(id: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findActiveByIdentifier(identifier: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
        deletedAt: null,
      },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findExistingInSystem(email: string, username: string): Promise<User[]> {
    const raws = await this._prisma.user.findMany({
      where: {
        OR: [{ email }, { username }]
      },
      include: this._userInclude
    });
    return raws.map(raw => this._toDomain(raw) as User);
  }

  async findByEmailInSystem(email: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { email },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findByUsernameInSystem(username: string): Promise<User | null> {
    const raw = await this._prisma.user.findFirst({
      where: { username },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async findByIdInSystem(id: string): Promise<User | null> {
    const raw = await this._prisma.user.findUnique({
      where: { id },
      include: this._userInclude
    });
    return this._toDomain(raw);
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const raw = await this._prisma.user.create({
      data: {
        ...data,
        userRoles: {
          create: user.roles.map(role => ({ roleId: role.id }))
        }
      },
      include: this._userInclude
    });

    return this._toDomain(raw) as User;
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const raw = await this._prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        userRoles: {
          deleteMany: {},
          create: user.roles.map(role => ({ roleId: role.id }))
        }
      },
      include: this._userInclude,
    });

    return this._toDomain(raw) as User;
  }

  async save(user: User): Promise<User> {
    const existing = await this.findActiveById(user.id as string);
    return existing ? await this.update(user) : await this.create(user);
  }

  async findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number
  ): Promise<[User[], number]> {
    const where: Prisma.UserWhereInput = {};

    // --- 1. MAPPING: Định nghĩa "bản đồ" ánh xạ từ FE sang BE ---
    // Việc này giúp ép kiểu chính xác mà không cần dùng any
    const fieldMapping: Record<string, keyof Prisma.UserWhereInput> = {
      name: 'fullName',
      fullName: 'fullName',
      email: 'email',
      username: 'username',
    };

    // Xác định field thực tế trong DB dựa trên sortBy từ FE
    // Nếu FE gửi 'name', dbField sẽ là 'fullName'. Nếu không khớp thì mặc định 'fullName'
    const dbField = fieldMapping[filter.sortBy as string] || 'fullName';
    const searchValue = filter.name;

    // --- 2. DYNAMIC SEARCH: Sort đâu - Search đó ---
    if (searchValue) {
      // Chỉ search nếu dbField là những cột có kiểu chuỗi (String)
      if (dbField === 'fullName' || dbField === 'email' || dbField === 'username') {
        where[dbField] = { contains: searchValue };
      }
    }

    // --- 3. LOGIC TRẠNG THÁI (Status Tabs) ---
    if (filter.status === 'active') {
      where.deletedAt = null;
      where.status = 'active';
    } else if (filter.status === 'deleted') {
      where.deletedAt = { not: null };
    } else if (filter.status === 'all') {
      // Admin xem hết
    } else {
      where.deletedAt = null;
    }

    // --- 4. LỌC THEO ROLE ---
    if (filter.roles) {
      where.userRoles = {
        some: {
          role: { name: { equals: filter.roles } }
        }
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
    const finalSortField = filter.sortBy === 'status' ? 'deletedAt' : (dbField as string);
    const sortOrder = filter.sortOrder || 'desc';

    // --- 7. THỰC THI TRUY VẤN ---
    const [rawUsers, total] = await this._prisma.$transaction([
      this._prisma.user.findMany({
        where,
        include: this._userInclude,
        skip,
        take,
        orderBy: [
          {
            [finalSortField]: sortOrder
          },
          {
            id: 'desc'
          }
        ],
      }),
      this._prisma.user.count({ where }),
    ]);

    return [rawUsers.map((raw) => this._toDomain(raw) as User), total];
  }
}