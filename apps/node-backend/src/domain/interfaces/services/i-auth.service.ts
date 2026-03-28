import { LoginInputDTO } from "@/application/dtos/request/loginInput.dto";
import { LoginResponseDTO } from "@/application/dtos/response/auth.dto";
import { ResetPasswordDTO } from "@/application/dtos/request/auth.dto";
import { TokenPayload } from "@/shared/types/auth.types";

/**
 * @interface IAuthService
 * @description Giao diện xử lý các quy trình xác thực và bảo mật tài khoản (Authentication & Account Security).
 * Đảm nhận vai trò kiểm soát truy cập, cấp phát token và quản lý phiên làm việc của người dùng.
 */
export interface IAuthService {

  /**
   * Đăng nhập vào hệ thống.
   * (Log in to the system).
   * * Thực hiện kiểm tra thông tin định danh (Username/Email & Password).
   * * Nếu hợp lệ, hệ thống sẽ cấp phát cặp Token (Access Token & Refresh Token).
   * * @param dto - Thông tin đăng nhập từ phía client.
   * @returns Đối tượng chứa thông tin User và các Token truy cập.
   */
  login(dto: LoginInputDTO): Promise<LoginResponseDTO>;

  /**
   * Đăng xuất khỏi hệ thống và thu hồi quyền truy cập.
   * (Log out and revoke access tokens).
   * * Thực hiện vô hiệu hóa Token hiện tại hoặc xóa session trên server.
   * * @param payload - Thông tin trích xuất từ Token (User ID, JTI...) để xác định phiên cần hủy.
   */
  logout(payload: TokenPayload): Promise<void>;

  /**
   * Yêu cầu khôi phục mật khẩu thông qua mã OTP.
   * (Request password recovery via OTP).
   * * Kiểm tra sự tồn tại của Email và gửi mã xác thực để người dùng chứng minh quyền sở hữu.
   * * @param email - Địa chỉ email cần khôi phục mật khẩu.
   */
  requestForgotPassword(email: string): Promise<void>;

  /**
   * Xác thực mã OTP và tiến hành đặt lại mật khẩu mới.
   * (Verify OTP and set a new password).
   * * Bước cuối cùng trong luồng quên mật khẩu (Forgot Password flow).
   * * @param dto - Bao gồm mã OTP, Email và Mật khẩu mới cần cập nhật.
   */
  resetPassword(dto: ResetPasswordDTO): Promise<void>;
}