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
 * @description DTO xử lý thay đổi mật khẩu, đảm bảo tính bảo mật và tính toàn vẹn của dữ liệu.
 */
export class ChangePasswordRequestDTO implements IChangePasswordInputDTO {
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(data: IChangePasswordInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Mapping và ép kiểu dữ liệu tường minh
    this.oldPassword = String(data.oldPassword || "");
    this.newPassword = String(data.newPassword || "");

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra các ràng buộc bảo mật mật khẩu dựa trên instance.
   */
  private validate(): void {
    const { USER } = ErrorCode;

    // 1. Kiểm tra sự hiện diện của mật khẩu (Sau khi ép kiểu)
    if (this.oldPassword === "") {
      throw new AppError(USER.OLD_PASSWORD_REQUIRED);
    }

    if (this.newPassword === "") {
      throw new AppError(USER.NEW_PASSWORD_REQUIRED);
    }

    // 2. Kiểm tra tính khác biệt giữa mật khẩu cũ và mới
    if (this.oldPassword === this.newPassword) {
      throw new AppError(USER.PASSWORD_MUST_BE_DIFFERENT);
    }

    // 3. Kiểm tra độ mạnh mật khẩu qua Regex
    if (!REGEX.PASSWORD.STRONG.test(this.newPassword)) {
      throw new AppError(USER.PASSWORD_TOO_WEAK);
    }
  }
}
