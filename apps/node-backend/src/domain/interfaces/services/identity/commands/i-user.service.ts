import { User } from "@/domain/entities/user/user.entity";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangePasswordRequestDTO } from "@/application/dtos/request/user/update-password.request.dto";
import { ChangeStatusRequestDTO } from "@/application/dtos/request/user/update-status.request.dto";
import { UpdateAdminRequestDTO } from "@/application/dtos/request/user/update-admin.request.dto";
import { ILoginResponseDTO } from "@/application/dtos/response/auth/auth.respone.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { IUserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";

/**
 * @description Interface định nghĩa các nghiệp vụ cốt lõi quản lý người dùng (User Domain).
 * Đóng vai trò là cầu nối giữa Application Layer và Domain Layer.
 */
export interface IUserService {
  /**
   * @description Cập nhật thông tin hồ sơ cá nhân của người dùng.
   * @param {string} userId - ID định danh duy nhất của người dùng.
   * @param {UpdateProfileRequestDTO} dto - Dữ liệu cập nhật (Họ tên, ảnh đại diện...).
   * @returns {Promise<ILoginResponseDTO>} Thực thể người dùng sau khi đã cập nhật thành công.
   */
  updateProfile(
    userId: string,
    dto: UpdateProfileRequestDTO,
  ): Promise<ILoginResponseDTO>;

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
  changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<IUserResponseDTO>;

  /**
   * @description Cập nhật trạng thái hoạt động của tài khoản người dùng.
   * @param {string} userId - ID người dùng cần thay đổi trạng thái.
   * @param {ChangeStatusRequestDTO} dto - Trạng thái mới cần thiết lập.
   * @returns {Promise<void>}
   */
  updateStatus(
    userId: string,
    dto: ChangeStatusRequestDTO,
  ): Promise<IUserResponseDTO>;

  /**
   * @description Thực hiện xóa mềm tài khoản (Soft Delete) khỏi hệ thống.
   * @param {string} userId - ID người dùng cần xóa.
   * @returns {Promise<void>}
   */
  deleteUser(userId: string): Promise<IDeleteResponseDTO>;

  /**
   * @description Khôi phục tài khoản người dùng đã bị xóa mềm trước đó.
   * @param {string} userId - ID người dùng cần khôi phục.
   * @returns {Promise<IUserResponseDTO>}
   */
  restoreUser(userId: string): Promise<IUserResponseDTO>;

  /**
   * @description Kiểm tra sự tồn tại của Tên đăng nhập hoặc Email trong hệ thống.
   * @param {string} username - Tên đăng nhập cần kiểm tra.
   * @param {string} email - Email cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu đã tồn tại bản ghi tương ứng.
   */
  checkExisting(username: string, email: string): Promise<boolean>;

  /**
   * @description Admin thực hiện cập nhật thông tin và quyền hạn của người dùng khác.
   * @param {string} userId - ID của người dùng mục tiêu.
   * @param {UpdateAdminRequestDTO} dto - Dữ liệu cập nhật (fullName, roles...).
   * @returns {Promise<void>}
   */
  updateUserByAdmin(userId: string, dto: UpdateAdminRequestDTO): Promise<void>;

  /**
   * @description Khởi tạo một người dùng mới vào hệ thống với các quyền mặc định.
   * @param {Object} data - Dữ liệu khởi tạo người dùng cơ bản.
   * @returns {Promise<User>} Thực thể User vừa được khởi tạo thành công.
   */
  createUser(user: User): Promise<User>;

}
