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

    switch (filter.status) {
      case 'active': where.status = 'active'; where.deletedAt = null; break;
      case 'locked': where.status = 'locked'; where.deletedAt = null; break;
      case 'deleted': where.deletedAt = { not: null }; break;
      case 'all': where.deletedAt = null; break;
      default: where.deletedAt = null; break;
    }

    if (filter.role) {
      where.userRoles = { some: { role: { name: filter.role } } };
    }

    if (filter.search) {
      where.OR = [
        { fullName: { contains: filter.search } },
        { email: { contains: filter.search } },
        { username: { contains: filter.search } }
      ];
    }

    const [rawUsers, total] = await this._prisma.$transaction([
      this._prisma.user.findMany({
        where,
        include: this._userInclude,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      this._prisma.user.count({ where })
    ]);

    const domainUsers = rawUsers.map(raw => this._toDomain(raw) as User);

    return [domainUsers, total];
  }
}