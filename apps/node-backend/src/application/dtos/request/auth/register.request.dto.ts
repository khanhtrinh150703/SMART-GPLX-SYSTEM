import { REGEX } from "@/domain/constants/regex.constant";
import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu đăng ký tài khoản.
 */
export interface IRegisterInputDTO {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly fullName?: string;
}

/**
 * @class RegisterRequestDTO
 * @description DTO xử lý đăng ký tài khoản mới, mapping trước khi validate.
 */
export class RegisterRequestDTO implements IRegisterInputDTO {
  public readonly username: string;
  public readonly email: string;
  public readonly password: string;
  public readonly confirmPassword: string;
  public readonly fullName?: string;

  /**
   * @param {IRegisterInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IRegisterInputDTO) {
    // 0. Guard Clause chặn object null/undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Gán và làm sạch dữ liệu)
    this.username =
      typeof data.username === "string"
        ? data.username.trim().toLowerCase()
        : "";

    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    this.password = typeof data.password === "string" ? data.password : "";

    this.confirmPassword =
      typeof data.confirmPassword === "string" ? data.confirmPassword : "";

    this.fullName =
      typeof data.fullName === "string" ? data.fullName.trim() : undefined;

    // 2. Validation (Kiểm tra logic trên dữ liệu đã mapping)
    this.validate(data);
  }

  /**
   * @private
   * @description Kiểm tra tính hợp lệ đa tầng, giữ nguyên các case cũ.
   * @param {IRegisterInputDTO} data - Dùng để check dữ liệu thô nếu cần.
   * @throws {AppError}
   */
  private validate(data: IRegisterInputDTO): void {
    // --- Validate Username ---
    if (!data.username || this.username.length < 3) {
      throw new AppError(ErrorCode.AUTH.USERNAME_INVALID);
    }

    // --- Validate Email ---
    if (!data.email || !REGEX.EMAIL.BASIC.test(data.email)) {
      throw new AppError(ErrorCode.AUTH.EMAIL_INVALID);
    }

    // --- Validate Password (Độ dài và độ phức tạp) ---
    if (
      !this.password ||
      this.password.length < 8 ||
      !REGEX.PASSWORD.COMPLEXITY.test(this.password)
    ) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
    }

    // --- Validate Confirm Password ---
    if (this.password !== this.confirmPassword) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_MISMATCH);
    }
  }
}
