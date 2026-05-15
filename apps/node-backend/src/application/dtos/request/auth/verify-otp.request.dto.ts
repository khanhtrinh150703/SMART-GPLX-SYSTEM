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
 * @description DTO xác thực tài khoản OTP, thực hiện mapping trước khi validate.
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

    // 1. Mapping & Sanitization (Làm sạch và gán giá trị)
    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    this.otp = typeof data.otp === "string" ? data.otp.trim() : "";

    // 2. Validation (Kiểm tra dữ liệu sau khi mapping)
    this.validate(data);
  }

  /**
   * @private
   * @description Hàm gác cổng ném AppError dựa trên mã lỗi hệ thống.
   * @param {IVerifyUserInputDTO} data - Dùng để check sự hiện diện nguyên bản.
   * @throws {AppError}
   */
  private validate(data: IVerifyUserInputDTO): void {
    // 1. Kiểm tra sự tồn tại (dựa trên data gốc)
    if (!data.email) throw new AppError(ErrorCode.AUTH.EMAIL_REQUIRED);
    if (!data.otp) throw new AppError(ErrorCode.AUTH.OTP_REQUIRED);

    // 2. Kiểm tra định dạng (dựa trên dữ liệu đã trim)
    if (this.otp.length !== 6) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }
  }
}
