import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import prisma from "../../../../prisma/prisma";
import { UserWithRolesPayload } from "@/shared/types/user-payload.type";
import { UserQueryDTO } from "@/application/dtos/request/user-query.dto";
import { Prisma } from "@prisma/client";


/**
 * Triển khai truy vấn dữ liệu User bằng Prisma cho cơ sở dữ liệu MySQL.
 * Tuân thủ nguyên tắc Clean Architecture: Chuyển đổi linh hoạt giữa Persistence Model và Domain Entity qua UserMapper.
 */
export class MySQLUserRepository implements IUserRepository {

  // Trong MySQLUserRepository
  private readonly _userIncludeMinimal = {
    userRoles: {
      select: { roleId: true }
    }
  };

  /**
   * Tìm kiếm người dùng đang hoạt động bằng Email.
   * Dùng cho các luồng đăng nhập, quên mật khẩu.
   * @param {string} email - Email của người dùng.
   * @returns {Promise<User | null>} - Trả về Entity User hoặc null nếu không tìm thấy/đã bị xóa.
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
   * Tìm kiếm người dùng đang hoạt động bằng Username.
   * @param {string} username - Tên đăng nhập.
   * @returns {Promise<User | null>} - Trả về Entity User hoặc null.
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
   * Tìm kiếm người dùng đang hoạt động bằng ID.
   * @param {string} id - UUID của người dùng.
   * @returns {Promise<User | null>} - Trả về Entity User hoặc null.
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
   * Tìm kiếm người dùng bằng một định danh bất kỳ (Email hoặc Username) và phải còn hoạt động.
   * Thường dùng cho form đăng nhập cho phép nhập cả 2 loại.
   * @param {string} identifier - Email hoặc Username.
   * @returns {Promise<User | null>}
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
   * Kiểm tra sự tồn tại của định danh (Email hoặc Username) trên toàn hệ thống.
   * LƯU Ý: Hàm này tìm kiếm CẢ những bản ghi đã bị xóa mềm (deletedAt != null).
   * Dùng để chặn trùng lặp khi Đăng ký mới.
   * @param {string} email - Email cần kiểm tra.
   * @param {string} username - Username cần kiểm tra.
   * @returns {Promise<User | null>} - Trả về Entity User nếu đã tồn tại trong DB, ngược lại null.
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

    // Map danh sách từ Database sang Entity
    return rawUsers.map(raw => UserMapper.toDomain(raw));
  }

  /**
   * Tìm kiếm người dùng bằng Email trên toàn bộ Database (Bao gồm cả đã xóa).
   * @param {string} email 
   * @returns {Promise<User | null>}
   */
  async findByEmailInSystem(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { email },
      include: this._userIncludeMinimal
      // Không có deletedAt ở đây -> Tìm tất cả
    });
    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * Tìm kiếm người dùng bằng Username trên toàn bộ Database (Bao gồm cả đã xóa).
   * @param {string} username 
   * @returns {Promise<User | null>}
   */
  async findByUsernameInSystem(username: string): Promise<User | null> {
    const rawUser = await prisma.user.findFirst({
      where: { username },
      include: this._userIncludeMinimal
      // Không có deletedAt ở đây -> Tìm tất cả
    });
    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }


  /**
   * Tìm kiếm người dùng đang hoạt động bằng ID.
   * @param {string} id - UUID của người dùng.
   * @returns {Promise<User | null>} - Trả về Entity User hoặc null.
   */
  async findByIdInSystem(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: {
        id,
      },
      include: this._userIncludeMinimal
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
     * Lưu người dùng mới kèm theo các quyền hạn đã gán ở Entity.
     * (Save a new user along with the permissions assigned in the Entity).
     * * * Sử dụng `UserMapper` để chuyển đổi từ Domain Entity sang Persistence Model.
     * * Thực hiện tạo bản ghi trong bảng trung gian `userRoles` (quan hệ N-N).
     * * @param user - Thực thể người dùng (User Domain Entity).
     * @returns Thực thể User sau khi đã được lưu vào cơ sở dữ liệu.
     */
  async create(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);
    // Đây là nơi Prisma thực hiện Transaction ngầm để tạo User + Roles
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

    const domainUser = UserMapper.toDomain(rawUser as UserWithRolesPayload);
    return domainUser;
  }

  /**
   * Cập nhật thông tin người dùng và ĐỒNG BỘ lại danh sách quyền.
   * (Update user information and SYNCHRONIZE the role list).
   * * * Logic đồng bộ Roles: Xóa tất cả các quan hệ cũ trong bảng trung gian và tạo mới dựa trên Entity hiện tại.
   * * Đảm bảo tính nhất quán giữa trạng thái của Entity và dữ liệu thực tế trong DB.
   * * @param user - Thực thể người dùng chứa các thông tin đã thay đổi.
   * @returns Thực thể User sau khi cập nhật thành công.
   */
  async update(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);

    const rawUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...persistenceData,
        // Logic đồng bộ Roles: Xóa cũ, thêm mới những gì đang có ở Entity
        userRoles: {
          deleteMany: {}, // Xóa hết các quan hệ cũ trong bảng trung gian
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
   * Lưu hoặc cập nhật (Upsert) - Đảm bảo tính nhất quán trong mô hình DDD.
   * (Save or Update (Upsert) - Commonly used in DDD to ensure consistency).
   * * * Kiểm tra sự tồn tại của người dùng dựa trên ID:
   * - Nếu đã tồn tại: Gọi phương thức `update`.
   * - Nếu chưa tồn tại: Gọi phương thức `create`.
   * * @param user - Thực thể người dùng cần được bền vững hóa (persist).
   * @returns Thực thể User đã được lưu/cập nhật.
   */
  async save(user: User): Promise<User> {
    const existing = await this.findActiveById(user.id);
    if (existing) {
      return await this.update(user);
    }
    return await this.create(user);
  }
  /**
   * @description Lấy danh sách user kèm phân trang.
   * Chuyển đổi từ UserQueryDTO sang định dạng Prisma.whereInput.
   */
  // src/repositories/user.repository.ts

  async findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number
  ): Promise<[User[], number]> {

    // 1. Khởi tạo object where (Initialize where object)
    const where: Prisma.UserWhereInput = {};

    /**
     * 2. Xử lý logic trạng thái (Status Logic Handling)
     * Phân tách dựa trên 3 trạng thái: Active, Locked, và Deleted (Soft-delete).
     */
    switch (filter.status) {
      case 'active':
        // Người dùng đang hoạt động: status là active và CHƯA bị xóa
        where.status = 'active';
        where.deletedAt = null; // IS NULL
        break;

      case 'locked':
        // Người dùng bị khóa: CHƯA bị xóa nhưng có status locked
        where.status = 'locked';
        where.deletedAt = null; // IS NULL
        break;

      case 'deleted':
        // Thùng rác: Chỉ lấy những bản ghi ĐÃ bị xóa (Soft-deleted records)
        where.deletedAt = { not: null }; // IS NOT NULL
        break;

      case 'all':
        // Lấy tất cả, không lọc theo deletedAt (Show everything)
        where.deletedAt = null;
        break;

      default:
        // Mặc định thường là chỉ lấy những người dùng chưa bị xóa
        where.deletedAt = null;
        break;
    }

    // 3. Lọc theo vai trò (Role filtering) - Truy vấn quan hệ N-N
    if (filter.role) {
      where.userRoles = {
        some: {
          role: { name: filter.role }
        }
      };
    }

    // 4. Tìm kiếm từ khóa (Search/Keyword matching)
    if (filter.search) {
      where.OR = [
        { fullName: { contains: filter.search, } },
        { email: { contains: filter.search, } },
        { username: { contains: filter.search, } }
      ];
    }

    // 5. Thực thi Database Transaction (Execute Transaction)
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

    // 6. Chuyển đổi về Domain Entity qua Mapper
    const domainUsers = (rawUsers as UserWithRolesPayload[]).map(raw =>
      UserMapper.toDomain(raw)
    );

    return [domainUsers, total];
  }
}