import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { User } from "@/domain/entities/user/user.entity";
import { UserRelatedCount } from "@/shared/types/count.types";
import { Prisma } from "@prisma/client";

/**
 * Interface định nghĩa các quy ước giao tiếp với dữ liệu User.
 * Tuân thủ nguyên tắc Dependency Inversion: Tầng Domain không phụ thuộc vào Database cụ thể.
 */
export interface IUserRepository {
  /**
   * @description Lấy danh sách user có phân trang và lọc
   * @param filter Các tiêu chí lọc (role, status, search keyword)
   * @param skip Số bản ghi bỏ qua
   * @param take Số bản ghi lấy ra
   */
  findAndCount(
    filter: UserQueryDTO,
    skip: number,
    take: number,
  ): Promise<[User[], number]>;

  /**
   * @description Tìm kiếm người dùng đang hoạt động bằng Email.
   * @param {string} email
   * @returns {Promise<User | null>}
   */
  findActiveByEmail(email: string): Promise<User | null>;

  /**
   * @description Tìm kiếm người dùng đang hoạt động bằng Username.
   * @param {string} username
   * @returns {Promise<User | null>}
   */
  findActiveByUsername(username: string): Promise<User | null>;

  /**
   * @description Tìm kiếm người dùng đang hoạt động bằng ID (UUID).
   * @param {string} id
   * @returns {Promise<User | null>}
   */
  findActiveById(id: string): Promise<User | null>;

  /**
   * @description Tìm kiếm người dùng đang hoạt động bằng một trong hai: Email hoặc Username.
   * @param {string} identifier - Có thể là Email hoặc Username.
   * @returns {Promise<User | null>}
   */
  findActiveByIdentifier(identifier: string): Promise<User | null>;

  /**
   * @description Tìm kiếm đích danh bằng Username và Email trên toàn bộ Database (Bao gồm cả đã xóa).
   * @param {string} username
   * @returns {Promise<User | null>}
   */
  findExistingInSystem(email: string, username: string): Promise<User[]>;

  /**
   * @description Tìm kiếm đích danh bằng Username trên toàn bộ Database (Bao gồm cả đã xóa).
   * @param {string} username
   * @returns {Promise<User | null>}
   */
  findByUsernameInSystem(username: string): Promise<User | null>;

  /**
   * @description Tìm kiếm người dùng đang hoạt động bằng một trong hai: Email hoặc Username.
   * @param {string} identifier - Có thể là Email hoặc Username.
   * @returns {Promise<User | null>}
   */
  findByIdInSystem(identifier: string): Promise<User | null>;

  /**
   * @description Tìm kiếm người dùng bằng Email trên toàn bộ Database (Bao gồm cả đã xóa).
   * @param {string} email
   * @returns {Promise<User | null>}
   */
  findByEmailInSystem(email: string): Promise<User | null>;

  /**
   * @description Lưu một người dùng mới vào hệ thống.
   * @param {User} user - Domain Entity của User.
   * @returns {Promise<User>} - Trả về Entity sau khi tạo thành công.
   */
  createUser(user: User): Promise<User>;

  /**
   * @description Cập nhật thông tin người dùng hiện có.
   * @param {User} user - Domain Entity chứa dữ liệu đã thay đổi.
   * @param {Prisma.TransactionClient} [tx] - (Tùy chọn) Client của transaction đang thực thi.
   * @returns {Promise<User>} - Trả về Entity sau khi cập nhật thành công.
   */
  updateUser(user: User, tx?: Prisma.TransactionClient): Promise<User>;

  /**
   * @description Xóa vĩnh viễn người dùng khỏi cơ sở dữ liệu (Hard Delete).
   * @param {string} id - ID của người dùng.
   * @returns {Promise<void>}
   */
  hardDelete(id: string): Promise<void>;

  /**
   * @description Đánh dấu xóa người dùng (Soft Delete) bằng cách cập nhật trường deletedAt.
   * @param {string} id - ID của người dùng.
   * @returns {Promise<void>}
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm (gỡ bỏ đánh dấu deleted_at).
   * @param {string} id - UUID của hạng bằng cần khôi phục.
   * @returns {Promise<void>}
   */
  restore(id: string): Promise<void>;

  /**
   * @description Thống kê chi tiết các dữ liệu nghiệp vụ đang liên kết với tài khoản người dùng này.
   * @param {string} id - Định danh duy nhất (UUID) của người dùng. (Unique identifier of the user).
   * @returns {Promise<UserRelatedCount>} Đối tượng chứa số lượng chi tiết các quan hệ (ví dụ: ExamAttempts, Payments, UserProgress). (Object containing counts of related entities).
   */
  countRelatedData(id: string): Promise<UserRelatedCount>;
}
