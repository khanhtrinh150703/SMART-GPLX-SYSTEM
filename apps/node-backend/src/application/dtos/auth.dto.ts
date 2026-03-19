import { REGEX } from "../../domain/constants/regex";

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
   * Kiểm tra tổng thể tính hợp lệ của DTO
   */
  public isValid(): boolean {
    return (
      this.isEmail() &&
      this.isPasswordMatching() &&
      this.password.length >= 8 &&
      this.validatePasswordComplexity(this.password)
    );
  }

  /**
   * Kiểm tra tính hợp lệ của mật khẩu
   */
  public isPassword(): boolean {
    return (
      this.isPasswordMatching() &&
      this.validatePasswordComplexity(this.password)
    );
  }
  
  /**
  * Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không
 */
  public isPasswordMapping(): boolean {
    return this.isPasswordMatching();
  }

  /**
   * Kiểm tra định dạng Email (Sử dụng mẫu BASIC)
   */
  public isEmail(): boolean {
    return this.validateEmailFormat(this.email);
  }

  /**
   * Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không
   */
  private isPasswordMatching(): boolean {
    return this.password === this.confirmPassword;
  }

  /**
   * Logic kiểm tra định dạng email
   */
  private validateEmailFormat(email: string): boolean {
    // Sử dụng cụm EMAIL.BASIC đã gom nhóm
    return REGEX.EMAIL.BASIC.test(email);
  }

  /**
   * Logic kiểm tra độ phức tạp mật khẩu
   */
  private validatePasswordComplexity(pass: string): boolean {
    // Regex: Ít nhất 1 chữ cái và 1 chữ số (Sử dụng cụm PASSWORD)
    return REGEX.PASSWORD.COMPLEXITY.test(pass);
  }
}