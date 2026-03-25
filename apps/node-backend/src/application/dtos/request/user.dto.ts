import { UserStatus } from "@/domain/entities/user/user.status";

/**
 * DTO cập nhật thông tin cá nhân.
 */
export class UpdateProfileDTO {
  readonly fullName?: string;
  readonly urlPicture?: string;

  constructor(data: Partial<UpdateProfileDTO>) {
    Object.assign(this, data);
  }
}

/**
 * DTO đổi mật khẩu.
 */
export class ChangePasswordDTO {
  readonly oldPassword!: string;
  readonly newPassword!: string;
  readonly confirmNewPassword!: string;

  constructor(data: Partial<ChangePasswordDTO>) {
    Object.assign(this, data);
  }

  public isPasswordMapping(): boolean {
    return !!this.newPassword && this.newPassword === this.confirmNewPassword;
  }

  public isNewPasswordDifferent(): boolean {
    return this.oldPassword !== this.newPassword;
  }

  public isPassword(): boolean {
    return !!this.newPassword && this.newPassword.length >= 8;
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