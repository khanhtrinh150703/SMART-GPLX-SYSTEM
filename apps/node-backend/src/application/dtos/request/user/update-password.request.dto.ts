import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description DTO chứa dữ liệu yêu cầu thay đổi mật khẩu định kỳ.
 * Đảm bảo tính bảo mật bằng cách yêu cầu mật khẩu cũ và kiểm tra độ mạnh của mật khẩu mới.
 */
export class ChangePasswordRequestDTO {
  /** @property {string} oldPassword - Mật khẩu hiện tại để xác thực quyền sở hữu. */
  public readonly oldPassword: string;

  /** @property {string} newPassword - Mật khẩu mới cần thiết lập. */
  public readonly newPassword: string;

  /**
   * @description Khởi tạo và ép kiểu dữ liệu an toàn cho các trường mật khẩu.
   */
  constructor(data: Record<string, unknown>) {
    this.oldPassword = typeof data.oldPassword === 'string' ? data.oldPassword : '';
    this.newPassword = typeof data.newPassword === 'string' ? data.newPassword : '';
  }

  /**
   * @description Thực hiện kiểm tra logic nghiệp vụ cho mật khẩu.
   * @throws {AppError} Ném lỗi nếu mật khẩu trống, trùng mật khẩu cũ hoặc không đủ độ mạnh.
   */
  public validateOrThrow(): void {
    // 1. Kiểm tra sự hiện diện
    if (!this.oldPassword || !this.newPassword) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }

    // 2. Kiểm tra tính khác biệt (UX: Không nên đổi mật khẩu mới giống hệt mật khẩu cũ)
    if (this.oldPassword === this.newPassword) {
      throw new AppError(ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT);
    }

    // 3. Kiểm tra độ phức tạp dựa trên chính sách bảo mật (Regex)
    if (!REGEX.PASSWORD.STRONG.test(this.newPassword)) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }
  }
}