import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu xác thực người dùng (OTP).
 */
export interface IVerifyUserInputDTO {
  readonly email: string;
  readonly otp: string;
}

/**
 * @class VerifyUserRequestDTO
 * @description DTO xác thực tài khoản OTP, thực hiện mapping trước khi validate dựa trên thuộc tính của class.
 */
export class VerifyUserRequestDTO implements IVerifyUserInputDTO {
  public readonly email: string;
  public readonly otp: string;

  /**
   * @param {IVerifyUserInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IVerifyUserInputDTO) {
    // 0. Guard Clause chặn object undefined/null
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Làm sạch và gán giá trị vào `this`)
    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    this.otp = typeof data.otp === "string" ? data.otp.trim() : "";

    // 2. Validation (Kiểm tra dữ liệu sau khi gán vào `this`)
    this.validate();
  }

  /**
   * @private
   * @description Hàm gác cổng ném AppError dựa trên mã lỗi hệ thống và thuộc tính của class.
   * @throws {AppError}
   */
  private validate(): void {
    // 1. Kiểm tra sự tồn tại (Dựa trên dữ liệu đã được gán và làm sạch trong `this`)
    if (this.email.length === 0) {
      throw new AppError(ErrorCode.AUTH.EMAIL_REQUIRED);
    }
    if (this.otp.length === 0) {
      throw new AppError(ErrorCode.AUTH.OTP_REQUIRED);
    }

    // 2. Kiểm tra định dạng (Dựa trên độ dài thực tế của OTP đã trim)
    if (this.otp.length !== 6) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }
  }
}
