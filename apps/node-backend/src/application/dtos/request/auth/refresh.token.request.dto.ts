import { AppError } from '@/shared/errors';
import { ErrorCode } from '@/shared/errors/error-codes';

/**
 * @description Data Transfer Object cho yêu cầu làm mới Access Token.
 * Tiếp nhận Refresh Token từ Client để thực hiện cấp phát Token mới.
 */
export class RefreshTokenRequestDTO {
  public readonly refreshToken: string;

  /**
   * @description Constructor nhận dữ liệu thô và thực hiện chuẩn hóa.
   * @param {Partial<RefreshTokenRequestDTO>} data - Dữ liệu từ Request Body.
   */
  constructor(data: Partial<RefreshTokenRequestDTO>) {
    // Tránh lỗi undefined khi truy cập string methods, đồng thời đảm bảo Zero Any
    this.refreshToken = data.refreshToken?.trim() || "";
  }

  /**
   * @description Tự kiểm tra tính hợp lệ của Refresh Token trước khi vào Service.
   * @throws {AppError} - Ném lỗi nếu token trống hoặc định dạng không hợp lệ.
   */
  public isValid(): void {
    // 1. Kiểm tra sự tồn tại
    if (!this.refreshToken) {
      throw new AppError(ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED);
    }

    // 2. Kiểm tra độ dài cơ bản (Refresh Token thường là JWT nên không thể quá ngắn)
    // Giả định tối thiểu 40 ký tự để lọc bớt rác ban đầu
    if (this.refreshToken.length < 40) {
      throw new AppError(ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID_FORMAT);
    }

    // 💡 Lưu ý cho Cậu Vàng: 
    // Logic kiểm tra chữ ký JWT và hết hạn sẽ được thực hiện ở tầng Infrastructure/Service 
    // bằng thư viện jsonwebtoken, DTO chỉ check định dạng thô.
  }
}