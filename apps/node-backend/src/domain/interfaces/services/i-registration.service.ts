import { RegisterDTO } from "@/application/dtos/request/auth.dto";
import { User } from "@/domain/entities/user/user.entity";

/**
 * @interface IRegistrationService
 * @description Giao diện điều phối luồng đăng ký người dùng (User Registration Workflow).
 * Quản lý vòng đời từ lúc bắt đầu đăng ký đến khi xác thực OTP thành công.
 */
export interface IRegistrationService {
  
  /**
   * Bước 1: Khởi tạo quy trình đăng ký.
   * (Step 1: Initiate the registration process).
   * * Hệ thống sẽ kiểm tra dữ liệu, lưu thông tin đăng ký tạm thời 
   * và gửi mã xác thực (OTP) đến phương thức liên lạc của người dùng.
   * * @param dto - Dữ liệu đăng ký từ người dùng (Họ tên, Email, Mật khẩu...).
   * @returns Một Promise hoàn thành khi mã OTP đã được gửi đi thành công.
   */
  initiate(dto: RegisterDTO): Promise<void>;

  /**
   * Bước 2: Xác thực mã OTP và chính thức tạo tài khoản.
   * (Step 2: Verify OTP and officially create the account).
   * * Chuyển đổi dữ liệu từ trạng thái chờ (Pending) sang tài khoản chính thức trong DB.
   * * @param email - Địa chỉ email của người dùng cần xác thực.
   * @param otp - Mã số xác thực một lần (One-Time Password).
   * @returns Thực thể User sau khi đã được lưu vào hệ thống.
   * @throws Error nếu mã OTP không chính xác hoặc đã hết hạn.
   */
  complete(email: string, otp: string): Promise<User>;

  /**
   * Yêu cầu hệ thống tạo và gửi lại mã OTP mới.
   * (Request to resend a new OTP code).
   * * Thường được dùng khi người dùng không nhận được mã hoặc mã cũ đã hết hạn.
   * * @param email - Địa chỉ email cần nhận lại mã xác thực.
   */
  resend(email: string): Promise<void>;
}