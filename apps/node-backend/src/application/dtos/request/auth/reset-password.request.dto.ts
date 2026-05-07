import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu đặt lại mật khẩu bằng mã OTP.
 */
export interface IResetPasswordInputDTO {
  readonly email: string;
  readonly otp: string;
  readonly newPassword: string;
}

/**
 * @description DTO xử lý đặt lại mật khẩu.
 * Thực hiện gác cổng dữ liệu và kiểm tra định dạng OTP/Password ngay khi khởi tạo.
 */
export class ResetPasswordRequestDTO implements IResetPasswordInputDTO {
  public readonly email: string;
  public readonly otp: string;
  public readonly newPassword: string;

  constructor(data: IResetPasswordInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Chuẩn hóa và gán giá trị
    this.email = data.email.trim().toLowerCase();
    this.otp = data.otp.trim();
    this.newPassword = data.newPassword;
  }

  /**
   * @description Hàm gác cổng thực hiện ném AppError dựa trên mã lỗi hệ thống.
   * @private
   */
  private validate(data: IResetPasswordInputDTO): void {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }
    
    // 1. Kiểm tra các trường bắt buộc
    if (!data.email || !data.otp || !data.newPassword) {
      throw new AppError(ErrorCode.AUTH.MISSING_FIELDS);
    }

    // 2. Kiểm tra định dạng OTP (Giả định 6 ký tự số)
    if (data.otp.trim().length !== 6) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }

    // 3. Kiểm tra độ dài mật khẩu mới (Ví dụ: tối thiểu 6 ký tự)
    if (data.newPassword.length < 6) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
    }
  }

  /**
   * @description Xác thực bổ sung nếu cần trước khi xử lý ở tầng Service.
   */
  public isValid(): void {
    // Có thể thêm kiểm tra Regex cho email hoặc password complexity tại đây
    if (this.newPassword.trim() === "") {
      throw new AppError(ErrorCode.AUTH.MISSING_FIELDS);
    }
  }
}