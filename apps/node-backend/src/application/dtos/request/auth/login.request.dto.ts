import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu đăng nhập.
 */
export interface ILoginInputDTO {
  readonly username: string;
  readonly password: string;
}

/**
 * @description DTO xử lý đăng nhập hệ thống. Tự động chuẩn hóa tài khoản và kiểm tra mật khẩu.
 */
export class LoginRequestDTO implements ILoginInputDTO {
  public readonly username: string;
  public readonly password: string;

  constructor(data: ILoginInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // --- 1. CHUẨN HÓA DỮ LIỆU (Normalize First) ---
    this.username =
      typeof data.username === "string"
        ? data.username.trim().toLowerCase()
        : "";

    this.password = typeof data.password === "string" ? data.password : "";

    // --- 2. TỰ XÁC THỰC (Validate Self) ---
    this.validate();
  }

  /**
   * @description Hàm gác cổng xác thực tài khoản và mật khẩu không được để trống.
   * @private
   */
  private validate(): void {
    const { AUTH } = ErrorCode;

    // Kiểm tra tài khoản sau khi đã chuẩn hóa
    if (this.username.length === 0) {
      throw new AppError(AUTH.USERNAME_REQUIRED);
    }

    // Kiểm tra mật khẩu
    if (this.password.length === 0) {
      throw new AppError(AUTH.PASSWORD_REQUIRED);
    }
  }
}
