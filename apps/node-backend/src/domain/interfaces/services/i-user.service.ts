import { User } from "@/domain/entities/user/user.entity";
import {
  ChangePasswordDTO,
  ChangeStatusDTO,
  UpdateProfileDTO
} from "@/application/dtos/request/user.dto";
import { UserQueryDTO } from "@/application/dtos/request/user-query.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { UserResponseDTO } from "@/application/dtos/response/user.dto";

/**
 * @interface IUserService
 * @description Interface định nghĩa các nghiệp vụ cốt lõi quản lý người dùng (User Domain).
 * Đóng vai trò là cầu nối giữa Application Layer và Domain Layer.
 */
export interface IUserService {

  /**
   * Cập nhật thông tin cá nhân của người dùng.
   * (Update profile information).
   * * @param userId - ID định danh duy nhất của người dùng.
   * @param dto - Dữ liệu cập nhật (họ tên, ảnh đại diện, v.v.).
   * @returns Thực thể User sau khi đã cập nhật.
   */
  updateProfile(userId: string, dto: UpdateProfileDTO): Promise<User>;

  /**
   * Lưu trực tiếp các thay đổi của thực thể User vào cơ sở dữ liệu.
   * (Persist user entity changes to DB).
   * * @param user - Đối tượng User entity đã được thay đổi dữ liệu.
   * @returns Thực thể User đã được lưu thành công.
   */
  update(user: User): Promise<User>;

  /**
   * Thực hiện đổi mật khẩu và thu hồi (logout) toàn bộ phiên đăng nhập hiện có.
   * (Change password and revoke all active sessions).
   * * @param userId - ID của người dùng thực hiện đổi mật khẩu.
   * @param dto - Chứa mật khẩu cũ và mật khẩu mới.
   * @throws Error nếu mật khẩu cũ không chính xác.
   */
  changePassword(userId: string, dto: ChangePasswordDTO): Promise<void>;

  /**
   * Thay đổi trạng thái hoạt động của người dùng (Ví dụ: Active, Banned, Pending).
   * (Update user account status).
   * * @param userId - ID người dùng cần thay đổi trạng thái.
   * @param dto - Trạng thái mới cần cập nhật.
   */
  updateStatus(userId: string, dto: ChangeStatusDTO): Promise<void>;

  /**
   * Thực hiện xóa mềm tài khoản (đánh dấu xóa nhưng không xóa vĩnh viễn trong DB).
   * (Soft delete user account).
   * * @param userId - ID người dùng cần xóa.
   */
  deleteUser(userId: string): Promise<void>;

  /**
   * Khôi phục tài khoản đã bị xóa mềm trước đó.
   * (Restore a soft-deleted user account).
   * * @param userId - ID người dùng cần khôi phục.
   */
  restoreUser(userId: string): Promise<void>;

  /**
   * Tìm kiếm người dùng dựa trên tên đăng nhập.
   * (Find user by username).
   * * @param username - Tên đăng nhập cần tìm.
   * @returns Thực thể User hoặc null nếu không tìm thấy.
   */
  getUserByUserName(username: string): Promise<User>;

  /**
   * Tìm kiếm người dùng dựa trên địa chỉ Email.
   * (Find user by email address).
   * * @param email - Email cần tìm.
   */
  getUserByEmail(email: string): Promise<User>;

  /**
   * Tìm kiếm người dùng qua một định danh bất kỳ (Username hoặc Email).
   * (Find user by identifier - username or email).
   * * @param identifier - Chuỗi định danh (Email/Username).
   */
  getUserByIdentifier(identifier: string): Promise<User>;

  /**
   * Kiểm tra sự tồn tại của Username hoặc Email trong hệ thống.
   * Thường dùng để validation khi đăng ký tài khoản mới.
   * (Check if username or email already exists).
   * * @returns true nếu đã tồn tại, false nếu chưa.
   */
  checkExisting(username: string, email: string): Promise<boolean>;

  /**
   * @description Lấy danh sách người dùng có hỗ trợ phân trang và bộ lọc tìm kiếm.
   * @summary Hàm này điều phối luồng dữ liệu giữa DTO, Logic phân trang và Repository.
   * * @param {UserQueryDTO} query - Đối tượng chứa các tham số truy vấn (page, limit, search, role, status).
   * @returns {Promise<PaginatedResult<User>>} Promise chứa danh sách User Entity và thông tin Metadata (total, totalPages, hasNext...).
   */
  getUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>>;
  /**
   * Khởi tạo một người dùng mới vào hệ thống kèm theo các quyền mặc định.
   * (Create a new user with default permissions).
   * * @param data - Thông tin khởi tạo người dùng cơ bản.
   * @returns Thực thể User vừa được tạo.
   */
  createUser(data: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    passwordHash: string;
  }): Promise<User>;
}