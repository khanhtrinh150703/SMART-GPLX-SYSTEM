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
 * @description DTO tiếp nhận và xác thực thô Refresh Token, mapping trước khi validate.
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

    // 3. Validation (Kiểm tra logic dựa trên dữ liệu gốc và dữ liệu đã map)
    this.validate(data);
  }

  /**
   * @private
   * @description Hàm gác cổng ném AppError nếu dữ liệu không đạt yêu cầu.
   * @param {IRefreshTokenInputDTO} data - Dùng để kiểm tra kiểu dữ liệu nguyên bản
   * @throws {AppError}
   */
  private validate(data: IRefreshTokenInputDTO): void {
    // Kiểm tra sự tồn tại và định dạng chuỗi
    if (!data.refreshToken || typeof data.refreshToken !== "string") {
      throw new AppError(ErrorCode.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    // Kiểm tra độ dài tối thiểu (sử dụng thuộc tính đã được trim)
    if (this.refreshToken.length < 40) {
      throw new AppError(ErrorCode.AUTH.INVALID_REFRESH_TOKEN);
    }
  }
}
