import { LoginRequestDTO } from "@/application/dtos/request/auth/login.request.dto";
import { RefreshTokenRequestDTO } from "@/application/dtos/request/auth/refresh.token.request.dto";
import { ResetPasswordRequestDTO } from "@/application/dtos/request/auth/reset-password.request.dto";
import { LoginResponseDTO } from "@/application/dtos/response/auth/auth.respone.dto";
import { TokenPayload, Tokens } from "@/shared/types/auth.types";

/**
 * @description Giao diện xử lý các quy trình xác thực và bảo mật tài khoản (Authentication & Account Security).
 * Đảm nhận vai trò kiểm soát truy cập, cấp phát token và quản lý phiên làm việc của người dùng.
 */
export interface IAuthService {

  /**
   * @description Thực hiện đăng nhập, xác thực danh tính và cấp phát bộ đôi Access/Refresh Token.
   * @param {LoginRequestDTO} dto - Thông tin định danh (Username/Email) và mật khẩu từ phía Client.
   * @returns {Promise<LoginResponseDTO>} Đối tượng chứa thông tin hồ sơ người dùng và các mã thông báo truy cập.
   */
  login(dto: LoginRequestDTO): Promise<LoginResponseDTO>;

  /**
   * @description Đăng xuất khỏi hệ thống và thu hồi quyền truy cập của phiên làm việc hiện tại.
   * @param {TokenPayload} payload - Thông tin trích xuất từ Token (User ID, JTI) để xác định phiên cần hủy.
   * @returns {Promise<void>}
   */
  logout(payload: TokenPayload): Promise<void>;

  /**
   * @description Khởi tạo quy trình khôi phục mật khẩu bằng cách gửi mã OTP xác thực qua Email.
   * @param {string} email - Địa chỉ email của tài khoản cần khôi phục mật khẩu.
   * @returns {Promise<void>}
   */
  requestForgotPassword(email: string): Promise<void>;

  /**
   * @description Xác thực mã OTP và tiến hành thiết lập mật khẩu mới cho tài khoản người dùng.
   * @param {ResetPasswordRequestDTO} dto - Dữ liệu bao gồm Email, mã OTP và mật khẩu mới cần cập nhật.
   * @returns {Promise<void>}
   */
  resetPassword(dto: ResetPasswordRequestDTO): Promise<void>;

  /**
   * @description Thực hiện làm mới cặp mã xác thực (Access & Refresh Token) bằng Refresh Token.
   * @param {RefreshTokenRequestDTO} dto - Đối tượng chứa mã Refresh Token hợp lệ.
   * @returns {Promise<Tokens>} Trả về một "Promise" chứa cặp mã xác thực mới (Access Token & Refresh Token).
   */
  refresh(dto: RefreshTokenRequestDTO): Promise<Tokens>;
}