import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu thay đổi mật khẩu.
 */
export interface IChangePasswordInputDTO {
  readonly oldPassword: string;
  readonly newPassword: string;
}

/**
 * @description DTO xử lý thay đổi mật khẩu định kỳ.
 * Đảm bảo mật khẩu mới đủ độ mạnh và khác biệt hoàn toàn với mật khẩu cũ.
 */
export class ChangePasswordRequestDTO implements IChangePasswordInputDTO {
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(data: IChangePasswordInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại "cửa ngõ"
    this.validate(data);

    // 2. Gán giá trị an toàn
    this.oldPassword = data.oldPassword;
    this.newPassword = data.newPassword;
  }

  /**
   * @description Hàm gác cổng kiểm tra bảo mật mật khẩu.
   * @private
   */
  private validate(data: IChangePasswordInputDTO): void {
    // Guard Clause
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    const { USER } = ErrorCode;

    // 1. Kiểm tra sự hiện diện
    if (!data.oldPassword || data.oldPassword.trim() === '') {
      throw new AppError(USER.OLD_PASSWORD_REQUIRED);
    }

    if (!data.newPassword || data.newPassword.trim() === '') {
      throw new AppError(USER.NEW_PASSWORD_REQUIRED);
    }

    // 2. Kiểm tra tính khác biệt
    if (data.oldPassword === data.newPassword) {
      throw new AppError(USER.PASSWORD_MUST_BE_DIFFERENT);
    }

    // 3. Kiểm tra độ phức tạp bảo mật
    if (!REGEX.PASSWORD.STRONG.test(data.newPassword)) {
      throw new AppError(USER.PASSWORD_TOO_WEAK);
    }
  }
}