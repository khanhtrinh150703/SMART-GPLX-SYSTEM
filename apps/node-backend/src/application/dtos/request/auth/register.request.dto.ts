import { REGEX } from "@/domain/constants/regex.constant";

/**
 * @description DTO chứa dữ liệu yêu cầu đăng ký tài khoản mới.
 * Tự chịu trách nhiệm kiểm tra tính hợp lệ về định dạng của các trường dữ liệu.
 */
export class RegisterRequestDTO {
  readonly username!: string;
  readonly email!: string;
  readonly password!: string;
  readonly confirmPassword!: string;
  readonly fullName?: string;

  constructor(data: Partial<RegisterRequestDTO>) {
    Object.assign(this, data);
  }

  /**
   * @description Kiểm tra tổng thể tính hợp lệ của dữ liệu đầu vào.
   * @returns {boolean}
   */
  public isValid(): boolean {
    return (
      this.isEmail() &&
      this.isPasswordMatching() &&
      this.isPassword()
    );
  }

  /** @description Kiểm tra độ dài và độ phức tạp mật khẩu. */
  public isPassword(): boolean {
    if (!this.password) return false;
    return this.password.length >= 8 && REGEX.PASSWORD.COMPLEXITY.test(this.password);
  }

  /** @description Kiểm tra định dạng Email qua Regex. */
  public isEmail(): boolean {
    if (!this.email) return false;
    return REGEX.EMAIL.BASIC.test(this.email);
  }

  /** @description Xác nhận mật khẩu và nhập lại mật khẩu phải trùng khớp. */
  public isPasswordMatching(): boolean {
    return !!this.password && this.password === this.confirmPassword;
  }
}