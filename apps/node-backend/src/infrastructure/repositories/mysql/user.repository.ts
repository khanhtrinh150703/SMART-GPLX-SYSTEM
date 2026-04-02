import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import prisma from "../../../../prisma/prisma";
import { UserWithRolesPayload } from "@/shared/types/user-payload.type";
import { UserQueryDTO } from "@/application/dtos/request/user-query.dto";
import { Prisma } from "@prisma/client";

/**
 * @description Triển khai Repository cho người dùng sử dụng MySQL và Prisma ORM.
 * Đảm bảo việc chuyển đổi linh hoạt giữa Persistence Model và Domain Entity thông qua UserMapper.
 */
export class MySQLUserRepository implements IUserRepository {

  /** @description Cấu hình truy vấn tối giản để lấy thông tin vai trò từ bảng trung gian. */
  private readonly _userIncludeMinimal = {
    userRoles: {
      select: { roleId: true }
    }
  };

  /**
   * @description Tìm kiếm người dùng đang hoạt động (chưa bị xóa mềm) thông qua địa chỉ Email.
   * @param {string} email - Địa chỉ email cần truy vấn.
   * @returns {Promise<User | null>} Thực thể Domain User hoặc null nếu không tồn tại.
   */
  async findActiveByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Tìm kiếm người dùng đang hoạt động thông qua tên đăng nhập.
   * @param {string} username - Tên đăng nhập cần truy vấn.
   * @returns {Promise<User | null>} Thực thể Domain User hoặc null nếu không tồn tại.
   */
  async findActiveByUsername(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: {
        username,
        deletedAt: null
      },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Truy vấn người dùng đang hoạt động dựa trên mã định danh duy nhất (ID).
   * @param {string} id - UUID của người dùng.
   * @returns {Promise<User | null>} Thực thể Domain User hoặc null nếu không tồn tại.
   */
  async findActiveById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Tìm kiếm linh hoạt người dùng đang hoạt động bằng Email hoặc Tên đăng nhập.
   * @param {string} identifier - Chuỗi định danh (Email/Username).
   * @returns {Promise<User | null>} Thực thể Domain User hoặc null nếu không tồn tại.
   */
  async findActiveByIdentifier(identifier: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ],
        deletedAt: null,
      },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Kiểm tra sự tồn tại của Email hoặc Tên đăng nhập trên toàn hệ thống (bao gồm bản ghi đã xóa mềm).
   * @param {string} email - Email cần kiểm tra.
   * @param {string} username - Tên đăng nhập cần kiểm tra.
   * @returns {Promise<User[]>} Danh sách các thực thể Domain User trùng lặp tìm thấy.
   */
  async findExistingInSystem(email: string, username: string): Promise<User[]> {
    const rawUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      },
      include: this._userIncludeMinimal
    });

    return rawUsers.map(raw => UserMapper.toDomain(raw));
  }

  /**
   * @description Truy vấn người dùng theo Email trên toàn bộ cơ sở dữ liệu mà không lọc trạng thái xóa.
   * @param {string} email - Email cần truy vấn.
   * @returns {Promise<User | null>}
   */
  async findByEmailInSystem(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { email },
      include: this._userIncludeMinimal
    });
    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Truy vấn người dùng theo Tên đăng nhập trên toàn bộ cơ sở dữ liệu mà không lọc trạng thái xóa.
   * @param {string} username - Tên đăng nhập cần truy vấn.
   * @returns {Promise<User | null>}
   */
  async findByUsernameInSystem(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { username },
      include: this._userIncludeMinimal
    });
    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Truy vấn người dùng theo ID trên toàn bộ cơ sở dữ liệu mà không lọc trạng thái xóa.
   * @param {string} id - UUID của người dùng.
   * @returns {Promise<User | null>}
   */
  async findByIdInSystem(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { id },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * @description Khởi tạo bản ghi người dùng mới và thiết lập các quan hệ vai trò (Roles) trong bảng trung gian.
   * @param {User} user - Thực thể Domain User chứa đầy đủ thông tin khởi tạo.
   * @returns {Promise<User>} Thực thể Domain User sau khi đã lưu trữ thành công.
   */
  async create(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);
    const rawUser = await prisma.user.create({
      data: {
        ...persistenceData,
        userRoles: {
          create: user.roles.map(role => ({
            roleId: role.id
          }))
        }
      },
      include: this._userIncludeMinimal
    });

    return UserMapper.toDomain(rawUser as UserWithRolesPayload);
  }

  /**
   * @description Cập nhật thông tin người dùng và đồng bộ hóa lại danh sách vai trò (Xóa cũ - Thêm mới).
   * @param {User} user - Thực thể Domain User chứa thông tin thay đổi.
   * @returns {Promise<User>} Thực thể Domain User sau khi cập nhật thành công.
   */
  async update(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);

    const rawUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...persistenceData,
        userRoles: {
          deleteMany: {}, 
          create: user.roles.map(role => ({
            roleId: role.id
          }))
        }
      },
      include: this._userIncludeMinimal,
    });

    return UserMapper.toDomain(rawUser as UserWithRolesPayload);
  }

  /**
   * @description Thực hiện lưu mới hoặc cập nhật (Upsert) dựa trên sự tồn tại của người dùng trong hệ thống.
   * @param {User} user - Thực thể Domain User cần bền vững hóa dữ liệu.
   * @returns {Promise<User>}
   */
  async save(user: User): Promise<User> {
    const existing = await this.findActiveById(user.id);
    if (existing) {
      return await this.update(user);
    }
    return await this.create(user);
  }

  /**
   * @description Truy vấn danh sách người dùng có hỗ trợ phân trang, lọc theo trạng thái, vai trò và từ khóa.
   * @param {UserQueryDTO} filter - Đối tượng chứa các tham số lọc và truy vấn.
   * @param {number} skip - Số lượng bản ghi cần bỏ qua.
   * @param {number} take - Số lượng bản ghi cần lấy.
   * @returns {Promise<[User[], number]>} Cặp giá trị gồm danh sách thực thể Domain và tổng số bản ghi thỏa mãn.
   */
  async findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number
  ): Promise<[User[], number]> {

    const where: Prisma.UserWhereInput = {};

    // Xử lý logic lọc theo trạng thái tài khoản
    switch (filter.status) {
      case 'active':
        where.status = 'active';
        where.deletedAt = null;
        break;
      case 'locked':
        where.status = 'locked';
        where.deletedAt = null;
        break;
      case 'deleted':
        where.deletedAt = { not: null };
        break;
      case 'all':
        where.deletedAt = null;
        break;
      default:
        where.deletedAt = null;
        break;
    }

    // Lọc theo tên vai trò (Relation filtering)
    if (filter.role) {
      where.userRoles = {
        some: {
          role: { name: filter.role }
        }
      };
    }

    // Tìm kiếm theo từ khóa (Full-name, Email, Username)
    if (filter.search) {
      where.OR = [
        { fullName: { contains: filter.search } },
        { email: { contains: filter.search } },
        { username: { contains: filter.search } }
      ];
    }

    // Thực thi truy vấn song song để lấy dữ liệu và tổng số lượng
    const [rawUsers, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: this._userIncludeMinimal,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const domainUsers = (rawUsers as UserWithRolesPayload[]).map(raw =>
      UserMapper.toDomain(raw)
    );

    return [domainUsers, total];
  }
}