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
 * @class ResetPasswordRequestDTO
 * @description DTO xử lý đặt lại mật khẩu, thực hiện mapping trước khi validate.
 */
export class ResetPasswordRequestDTO implements IResetPasswordInputDTO {
  public readonly email: string;
  public readonly otp: string;
  public readonly newPassword: string;

  /**
   * @param {IResetPasswordInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IResetPasswordInputDTO) {
    // 0. Guard Clause chặn object null/undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Gán và làm sạch dữ liệu)
    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    this.otp = typeof data.otp === "string" ? data.otp.trim() : "";

    this.newPassword =
      typeof data.newPassword === "string" ? data.newPassword : "";

    // 2. Validation (Kiểm tra logic dựa trên dữ liệu gốc và dữ liệu đã map)
    this.validate(data);
  }

  /**
   * @private
   * @description Hàm gác cổng ném AppError nếu dữ liệu không đạt yêu cầu.
   * @param {IResetPasswordInputDTO} data - Dùng để kiểm tra trường bắt buộc
   * @throws {AppError}
   */
  private validate(data: IResetPasswordInputDTO): void {
    // 1. Kiểm tra các trường bắt buộc
    if (!data.email) throw new AppError(ErrorCode.AUTH.EMAIL_REQUIRED);
    if (!data.otp) throw new AppError(ErrorCode.AUTH.OTP_REQUIRED);
    if (!data.newPassword)
      throw new AppError(ErrorCode.AUTH.NEW_PASSWORD_REQUIRED);

    // 2. Kiểm tra định dạng OTP (Sử dụng giá trị đã trim)
    if (this.otp.length !== 6) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }

    // 3. Kiểm tra độ dài mật khẩu mới
    if (this.newPassword.length < 6) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
    }
  }

  /**
   * @public
   * @description Xác thực bổ sung trước khi xử lý ở tầng Service.
   * @throws {AppError}
   */
  public isValid(): void {
    if (this.newPassword.trim() === "") {
      throw new AppError(ErrorCode.AUTH.MISSING_FIELDS);
    }
  }
}
