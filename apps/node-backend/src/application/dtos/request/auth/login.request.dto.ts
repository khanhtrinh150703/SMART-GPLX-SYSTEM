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
 * @description DTO xử lý đăng nhập hệ thống.
 * Đảm bảo dữ liệu luôn đúng định dạng và không được để trống trước khi đi vào tầng Auth Service.
 */
export class LoginRequestDTO implements ILoginInputDTO {
  readonly username: string;
  readonly password: string;

  constructor(data: ILoginInputDTO) {
    // 1. Chặn lỗi undefined ngay lập tức
    this.validate(data);

    // 2. Gán giá trị sau khi đã đảm bảo dữ liệu "sạch"
    this.username = data.username.trim();
    this.password = data.password;
  }

  /**
   * @description Hàm xác thực logic đầu vào.
   * @throws {AppError} Nếu dữ liệu không hợp lệ.
   */
  private validate(data: ILoginInputDTO): void {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Check Username
    if (!data.username || typeof data.username !== 'string' || data.username.trim().length === 0) {
      throw new AppError(ErrorCode.AUTH.USERNAME_REQUIRED);
    }

    // Check Password
    if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
      throw new AppError(
        ErrorCode.AUTH.PASSWORD_REQUIRED);
    }
  }
}