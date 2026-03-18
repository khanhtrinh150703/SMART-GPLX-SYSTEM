import { REGEX } from "../../domain/constants/regex";


export class RegisterDTO {
  // Readonly để đảm bảo tính bất biến (immutability) trong suốt quá trình xử lý
  readonly username!: string;
  readonly email!: string;
  readonly password!: string;
  readonly confirmPassword!: string;
  readonly fullName?: string; // Dấu ? vì theo Excel trường này có thể không bắt buộc lúc đầu

  constructor(data: Partial<RegisterDTO>) {
    Object.assign(this, data);
  }

  /**
   * Phương thức kiểm tra logic cơ bản ngay tại DTO
   * Giúp đảm bảo dữ liệu "sạch" trước khi chạm tới Service
   */
  public isValid(): boolean {
    return (
      this.password === this.confirmPassword &&
      this.password.length >= 8 &&
      this.validatePasswordComplexity(this.password)
    );
  }

  private validatePasswordComplexity(pass: string): boolean {
    // Regex: Ít nhất 1 chữ cái và 1 chữ số (Theo US-04)
    const regex = REGEX.PASSWORD_COMPLEXITY;
    return regex.test(pass);
  }
}