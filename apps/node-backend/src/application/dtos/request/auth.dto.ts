import { REGEX } from "@/domain/constants/regex.constant";

/**
 * Data Transfer Object cho quy trình đăng ký người dùng mới.
 * Tự chịu trách nhiệm kiểm tra định dạng dữ liệu đầu vào.
 */
export class RegisterDTO {
  readonly username!: string;
  readonly email!: string;
  readonly password!: string;
  readonly confirmPassword!: string;
  readonly fullName?: string;

  constructor(data: Partial<RegisterDTO>) {
    Object.assign(this, data);
  }

  /**
   * Tác dụng: Kiểm tra tổng thể tính hợp lệ của dữ liệu đăng ký.
   * @returns {boolean} - Trả về true nếu tất cả các trường đều hợp lệ.
   */
  public isValid(): boolean {
    return (
      this.isEmail() &&
      this.isPasswordMatching() &&
      this.isPassword()
    );
  }

  /**
   * Tác dụng: Kiểm tra định dạng mật khẩu (độ dài và độ phức tạp).
   * @returns {boolean}
   */
  public isPassword(): boolean {
    // Kiểm tra tồn tại trước khi check length để tránh crash
    if (!this.password) return false;
    
    return (
      this.password.length >= 8 &&
      REGEX.PASSWORD.COMPLEXITY.test(this.password)
    );
  }

  /**
   * Tác dụng: Kiểm tra định dạng Email dựa trên Regex.
   * @returns {boolean}
   */
  public isEmail(): boolean {
    if (!this.email) return false;
    return REGEX.EMAIL.BASIC.test(this.email);
  }

  /**
   * Tác dụng: Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không.
   * @returns {boolean}
   */
  public isPasswordMatching(): boolean {
    // Đảm bảo cả 2 đều tồn tại và giống hệt nhau
    return !!this.password && this.password === this.confirmPassword;
  }

  /**
   * Tác dụng: Hàm alias cho isPasswordMatching (giữ lại nếu bạn đang dùng ở Service khác).
   */
  public isPasswordMapping(): boolean {
    return this.isPasswordMatching();
  }
}

export class VerifyUserDTO {
  readonly email: string;
  readonly otp: string;

  constructor(data: { email: string; otp: string }) {
    this.email = data.email;
    this.otp = data.otp;
  }
}