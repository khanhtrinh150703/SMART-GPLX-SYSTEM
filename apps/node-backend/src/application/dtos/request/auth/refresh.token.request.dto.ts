import { AppError } from '@/shared/errors';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu làm mới Token.
 */
export interface IRefreshTokenInputDTO {
  readonly refreshToken: string;
}

/**
 * @description DTO đảm nhận việc tiếp nhận và xác thực thô Refresh Token.
 * Ngăn chặn các token rỗng hoặc không đúng định dạng cơ bản ngay từ vòng gửi xe.
 */
export class RefreshTokenRequestDTO implements IRefreshTokenInputDTO {
  public readonly refreshToken: string;

  constructor(data: IRefreshTokenInputDTO) {
    // 1. Kiểm tra tính hiện diện của data (Null Guard) và logic bên trong
    this.validate(data);

    // 2. Gán giá trị sau khi đã trim() để làm sạch dữ liệu
    this.refreshToken = data.refreshToken.trim();
  }

  /**
   * @description Hàm bảo vệ, ném AppError ngay nếu dữ liệu không đạt yêu cầu.
   * @private
   */
  private validate(data: IRefreshTokenInputDTO): void {
    // Chặn đứng lỗi "Cannot read properties of undefined"
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Kiểm tra sự tồn tại của Token
    if (!data.refreshToken || typeof data.refreshToken !== 'string') {
      throw new AppError(ErrorCode.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    // Kiểm tra độ dài cơ bản (JWT thường > 40 ký tự)
    if (data.refreshToken.trim().length < 40) {
      throw new AppError(ErrorCode.AUTH.INVALID_REFRESH_TOKEN);
    }
  }
}