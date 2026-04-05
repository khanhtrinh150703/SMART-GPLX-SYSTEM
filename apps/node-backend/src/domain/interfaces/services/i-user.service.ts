import { User } from "@/domain/entities/user/user.entity";

import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { UserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangePasswordRequestDTO } from "@/application/dtos/request/user/update-password.request.dto";
import { ChangeStatusRequestDTO } from "@/application/dtos/request/user/update-status.request.dto";
import { LoginResponseDTO } from "@/application/dtos/response/auth/auth.respone.dto";

/**
 * @description Interface định nghĩa các nghiệp vụ cốt lõi quản lý người dùng (User Domain).
 * Đóng vai trò là cầu nối giữa Application Layer và Domain Layer.
 */
export interface IUserService {

  /**
   * @description Cập nhật thông tin hồ sơ cá nhân của người dùng.
   * @param {string} userId - ID định danh duy nhất của người dùng.
   * @param {UpdateProfileRequestDTO} dto - Dữ liệu cập nhật (Họ tên, ảnh đại diện...).
   * @returns {Promise<LoginResponseDTO>} Thực thể người dùng sau khi đã cập nhật thành công.
   */
  updateProfile(userId: string, dto: UpdateProfileRequestDTO): Promise<LoginResponseDTO>;

  /**
   * @description Lưu trực tiếp các thay đổi của thực thể User vào cơ sở dữ liệu.
   * @param {User} user - Đối tượng User Entity đã được thay đổi dữ liệu.
   * @returns {Promise<User>} Thực thể User đã được lưu trữ thành công.
   */
  update(user: User): Promise<User>;

  /**
   * @description Thay đổi mật khẩu và vô hiệu hóa toàn bộ phiên đăng nhập hiện có.
   * @param {string} userId - ID người dùng thực hiện đổi mật khẩu.
   * @param {ChangePasswordRequestDTO} dto - Chứa mật khẩu cũ và mật khẩu mới.
   * @returns {Promise<void>}
   */
  changePassword(userId: string, dto: ChangePasswordRequestDTO): Promise<void>;

  /**
   * @description Cập nhật trạng thái hoạt động của tài khoản người dùng.
   * @param {string} userId - ID người dùng cần thay đổi trạng thái.
   * @param {ChangeStatusRequestDTO} dto - Trạng thái mới cần thiết lập.
   * @returns {Promise<void>}
   */
  updateStatus(userId: string, dto: ChangeStatusRequestDTO): Promise<void>;

  /**
   * @description Thực hiện xóa mềm tài khoản (Soft Delete) khỏi hệ thống.
   * @param {string} userId - ID người dùng cần xóa.
   * @returns {Promise<void>}
   */
  deleteUser(userId: string): Promise<void>;

  /**
   * @description Khôi phục tài khoản người dùng đã bị xóa mềm trước đó.
   * @param {string} userId - ID người dùng cần khôi phục.
   * @returns {Promise<void>}
   */
  restoreUser(userId: string): Promise<void>;

  /**
   * @description Tìm kiếm người dùng dựa trên tên đăng nhập.
   * @param {string} username - Tên đăng nhập cần truy vấn.
   * @returns {Promise<User>}
   */
  getUserByUserName(username: string): Promise<User>;

  /**
   * @description Tìm kiếm người dùng dựa trên địa chỉ Email.
   * @param {string} email - Địa chỉ email cần truy vấn.
   * @returns {Promise<User>}
   */
  getUserByEmail(email: string): Promise<User>;

  /**
   * @description Tìm kiếm người dùng linh hoạt qua Email hoặc Tên đăng nhập.
   * @param {string} identifier - Chuỗi định danh (Email/Username).
   * @returns {Promise<User>}
   */
  getUserByIdentifier(identifier: string): Promise<User>;

  /**
   * @description Kiểm tra sự tồn tại của Tên đăng nhập hoặc Email trong hệ thống.
   * @param {string} username - Tên đăng nhập cần kiểm tra.
   * @param {string} email - Email cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu đã tồn tại bản ghi tương ứng.
   */
  checkExisting(username: string, email: string): Promise<boolean>;

  /**
   * @description Lấy thông tin chi tiết của một người dùng dựa trên mã định danh (ID).
   * @param {string} userId - Mã định danh (ID) của người dùng cần truy xuất.
   * @returns {Promise<User>} Trả về đối tượng người dùng (User) tương ứng.
   */
  getUserById(userId: string): Promise<User>;

  /**
   * @description Truy vấn danh sách người dùng có hỗ trợ phân trang và bộ lọc tìm kiếm.
   * @param {UserQueryDTO} query - Tham số truy vấn (Page, Limit, Search, Role, Status).
   * @returns {Promise<PaginatedResult<UserResponseDTO>>} Kết quả phân trang và siêu dữ liệu (Metadata).
   */
  getUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>>;

  /**
   * @description Khởi tạo một người dùng mới vào hệ thống với các quyền mặc định.
   * @param {Object} data - Dữ liệu khởi tạo người dùng cơ bản.
   * @returns {Promise<User>} Thực thể User vừa được khởi tạo thành công.
   */
  createUser(data: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    passwordHash: string;
  }): Promise<User>;
}