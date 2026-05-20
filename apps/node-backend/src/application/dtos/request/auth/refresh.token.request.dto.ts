import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu làm mới Token.
 */
export interface IRefreshTokenInputDTO {
  readonly refreshToken: string;
}

/**
 * @class RefreshTokenRequestDTO
 * @description DTO tiếp nhận và xác thực thô Refresh Token, mapping trước khi validate dựa trên thuộc tính của class.
 */
export class RefreshTokenRequestDTO implements IRefreshTokenInputDTO {
  /** @readonly */
  public readonly refreshToken: string;

  /**
   * @param {IRefreshTokenInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IRefreshTokenInputDTO) {
    // 1. Guard Clause chặn object null/undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 2. Mapping & Sanitization (Gán giá trị và làm sạch)
    this.refreshToken =
      typeof data.refreshToken === "string" ? data.refreshToken.trim() : "";

    // 3. Validation (Kiểm tra logic dựa trên các thuộc tính của `this`)
    this.validate();
  }

  /**
   * @private
   * @description Hàm gác cổng ném AppError nếu dữ liệu không đạt yêu cầu dựa trên thuộc tính của class.
   * @throws {AppError}
   */
  private validate(): void {
    // Kiểm tra sự tồn tại và kiểu dữ liệu (đã được lọc ở bước mapping)
    // Nếu dữ liệu thô không phải string, bước mapping đã gán thành chuỗi rỗng ""
    if (!this.refreshToken || this.refreshToken.length === 0) {
      throw new AppError(ErrorCode.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    // Kiểm tra độ dài tối thiểu của token đã được làm sạch
    if (this.refreshToken.length < 40) {
      throw new AppError(ErrorCode.AUTH.INVALID_REFRESH_TOKEN);
    }
  }
}
