import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import prisma from "../../../../prisma/prisma";

/**
 * Triển khai truy vấn dữ liệu User bằng Prisma cho cơ sở dữ liệu MySQL.
 * Tuân thủ nguyên tắc Clean Architecture: Chuyển đổi linh hoạt giữa Persistence Model và Domain Entity qua UserMapper.
 */
export class UserRepository implements IUserRepository {

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
      }
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
      }
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
      }
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
        deletedAt: null
      }
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
      }
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
      where: { email } // Không có deletedAt ở đây -> Tìm tất cả
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
      where: { username } // Không có deletedAt ở đây -> Tìm tất cả
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
      }
    });

    return rawUser ? UserMapper.toDomain(rawUser) : null;
  }

  /**
   * Lưu người dùng mới vào database.
   * @param {User} user - Domain Entity chứa thông tin user mới.
   * @returns {Promise<User>} - Entity User sau khi đã lưu thành công.
   */
  async create(user: User): Promise<User> {
    // Chuyển từ Domain Entity sang Persistence Model để Prisma có thể hiểu
    const persistenceData = UserMapper.toPersistence(user);

    const rawUser = await prisma.user.create({
      data: persistenceData
    });

    // Chuyển ngược lại sang Domain Entity để duy trì tính đóng gói
    return UserMapper.toDomain(rawUser);
  }

  /**
   * Cập nhật thông tin người dùng.
   * @param {User} user - Domain Entity đã được thay đổi dữ liệu.
   * @returns {Promise<User>} - Entity User sau khi cập nhật.
   */
  async update(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);

    const rawUser = await prisma.user.update({
      where: { id: user.id },
      data: persistenceData
    });

    return UserMapper.toDomain(rawUser);
  }
}