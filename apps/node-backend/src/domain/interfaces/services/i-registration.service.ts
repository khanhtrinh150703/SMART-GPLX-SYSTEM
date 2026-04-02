import { RegisterDTO } from "@/application/dtos/request/auth.dto";
import { User } from "@/domain/entities/user/user.entity";

/**
 * Interface điều phối luồng đăng ký người dùng (User Registration Workflow).
 */
export interface IRegistrationService {
  
  /**
   * @description Khởi tạo quy trình đăng ký, lưu thông tin tạm thời và gửi mã OTP.
   * @param {RegisterDTO} dto - Dữ liệu đăng ký đầu vào.
   * @returns {Promise<void>}
   */
  initiate(dto: RegisterDTO): Promise<void>;

  /**
   * @description Xác thực mã OTP và chính thức tạo tài khoản người dùng trong cơ sở dữ liệu.
   * @param {string} email - Địa chỉ email cần xác thực.
   * @param {string} otp - Mã xác thực một lần.
   * @returns {Promise<User>} Thực thể người dùng sau khi khởi tạo thành công.
   */
  complete(email: string, otp: string): Promise<User>;

  /**
   * @description Tạo và gửi lại mã OTP mới khi mã cũ hết hạn hoặc bị thất lạc.
   * @param {string} email - Địa chỉ email nhận lại mã xác thực.
   * @returns {Promise<void>}
   */
  resend(email: string): Promise<void>;
}