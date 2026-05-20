import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";
import { REGEX } from "@/domain/constants/regex.constant";

/**
 * @description Giao diện dữ liệu đầu vào cho nghiệp vụ tạo người dùng mới (đăng ký/admin tạo).
 * Chứa dữ liệu thô chưa qua xử lý logic hay băm (hash) mật khẩu.
 */
export interface ICreateUserInput {
  readonly username: string;
  readonly email: string;
  readonly fullName: string;
  readonly passwordPlain: string;
}

export class CreateUserRequestDTO implements ICreateUserInput {
  public readonly username: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly passwordPlain: string;

  constructor(data: ICreateUserInput) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization
    this.username =
      typeof data.username === "string"
        ? data.username.trim().toLowerCase()
        : "";
    this.email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    this.fullName =
      typeof data.fullName === "string" ? data.fullName.trim() : "";
    this.passwordPlain =
      typeof data.passwordPlain === "string" ? data.passwordPlain : "";

    // 2. Validation dựa trên thuộc tính của `this`
    this.validate();
  }

  private validate(): void {
    if (this.username.length < 3) {
      throw new AppError(ErrorCode.AUTH.USERNAME_INVALID);
    }
    if (this.fullName.length === 0) {
      throw new AppError(ErrorCode.AUTH.FULL_NAME_INVALID);
    }
    if (!this.email || !REGEX.EMAIL.BASIC.test(this.email)) {
      throw new AppError(ErrorCode.AUTH.EMAIL_INVALID);
    }
    if (this.passwordPlain.length < 8) {
      throw new AppError(ErrorCode.AUTH.PASSWORD_TOO_WEAK);
    }
  }
}
