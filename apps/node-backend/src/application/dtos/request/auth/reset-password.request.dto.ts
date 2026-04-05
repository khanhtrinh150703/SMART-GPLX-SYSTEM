import { AppError } from '@/shared/errors/error-app';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * @description DTO chứa dữ liệu yêu cầu đặt lại mật khẩu bằng mã OTP.
 */
export class ResetPasswordRequestDTO {
  public readonly email: string;
  public readonly otp: string;
  public readonly newPassword: string;

  constructor(data: ResetPasswordRequestDTO) {
    this.email = data.email;
    this.otp = data.otp;
    this.newPassword = data.newPassword;
  }

  /**
   * @description Xác thực dữ liệu đầu vào, ném lỗi AppError nếu không hợp lệ.
   * @throws {AppError}
   */
  public validateOrThrow(): void {
    if (!this.email || !this.otp || !this.newPassword) {
      throw new AppError(ErrorCode.AUTH.MISSING_FIELDS);
    }
    if (this.otp.length !== 6) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }
  }
}