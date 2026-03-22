import { UserStatus } from "@/domain/constants/userStatus";

export class UpdateProfileDTO {
  fullName?: string;
  urlPicture?: string;

  // Constructor này giúp tự động map dữ liệu từ req.body vào object DTO
  constructor(data: Partial<UpdateProfileDTO>) {
    Object.assign(this, data);
  }
}

export class ChangePasswordDTO {
  oldPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string; // Bổ sung trường này để Frontend gửi lên

  constructor(data: Partial<ChangePasswordDTO>) {
    Object.assign(this, data);
  }

  // 1. Kiểm tra: Mật khẩu mới và Xác nhận mật khẩu mới CÓ KHỚP NHAU KHÔNG?
  public isPasswordMapping(): boolean {
    return this.newPassword === this.confirmNewPassword;
  }

  // 2. Kiểm tra: Mật khẩu mới PHẢI KHÁC mật khẩu cũ
  public isNewPasswordDifferent(): boolean {
    return this.oldPassword !== this.newPassword;
  }

  // 3. Kiểm tra: Độ phức tạp của mật khẩu mới (Giống hệt như lúc Register)
  public isPassword(): boolean {
    // Tùy logic regex của bạn, ví dụ đơn giản là dài hơn hoặc bằng 8 ký tự
    if (!this.newPassword) return false;
    return this.newPassword.length >= 8;
  }
}

export class ChangeStatusDTO {
  status!: UserStatus;

  constructor(data: Partial<ChangeStatusDTO>) {
    Object.assign(this, data);
  }
}

export class VerifyUserDTO {
  email: string;
  otp: string;

  // Ở đây ta định nghĩa data PHẢI có đủ email và otp
  constructor(data: { email: string; otp: string }) {
    this.email = data.email;
    this.otp = data.otp;
  }
}