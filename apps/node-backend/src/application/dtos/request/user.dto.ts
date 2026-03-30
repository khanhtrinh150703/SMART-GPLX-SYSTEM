import { REGEX } from "@/domain/constants/regex.constant";
import { UserStatus } from "@/domain/entities/user/user.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUpdateProfileInput, IUploadedFile } from "@/shared/types/file.type";

/**
 * DTO cập nhật thông tin cá nhân.
 */
export class UpdateProfileDTO {
  readonly fullName?: string;
  readonly pictureFile?: IUploadedFile;

  constructor(data: IUpdateProfileInput) {
    this.fullName = data.fullName;
    this.pictureFile = data.pictureFile;
  }

  /**
   * Kiểm tra tính hợp lệ của dữ liệu đầu vào
   */
  public isValid(): boolean {
    return !!(this.fullName || this.pictureFile);
  }
}
/**
 * DTO đổi mật khẩu.
 */

export class ChangePasswordDTO {
  public readonly oldPassword: string;
  public readonly newPassword: string;

  constructor(data: Record<string, unknown>) {
    this.oldPassword = typeof data.oldPassword === 'string' ? data.oldPassword : '';
    this.newPassword = typeof data.newPassword === 'string' ? data.newPassword : '';
  }

  /**
   * Tác dụng: Tự kiểm tra tính hợp lệ của dữ liệu đầu vào.
   */
  public validateOrThrow(): void {
    if (!this.oldPassword || !this.newPassword) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }
    if (this.oldPassword === this.newPassword) {
      throw new AppError(ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT);
    }
    if (!REGEX.PASSWORD.STRONG.test(this.newPassword)) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }
  }
}

/**
 * DTO thay đổi trạng thái (Admin).
 */
export class ChangeStatusDTO {
  readonly status!: UserStatus;

  constructor(data: Partial<ChangeStatusDTO>) {
    Object.assign(this, data);
  }
}