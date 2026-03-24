/**
 * Data Transfer Object cho yêu cầu đăng nhập.
 */
export class LoginInputDTO {
  readonly username!: string;
  readonly password!: string;

  constructor(data: Partial<LoginInputDTO>) {
    Object.assign(this, data);
  }

  /**
   * Tác dụng: Kiểm tra xem người dùng đã nhập đủ thông tin cần thiết chưa.
   * @returns {boolean}
   */
  public isValid(): boolean {
    // Với Login, chỉ cần username và password không được để trống
    return this.isUsernameValid() && this.isPasswordValid();
  }

  /**
   * Tác dụng: Kiểm tra tính hợp lệ của username.
   * @returns {boolean}
   */
  private isUsernameValid(): boolean {
    // Có thể check độ dài tối thiểu nếu cần
    return !!this.username && this.username.trim().length > 0;
  }

  /**
   * Tác dụng: Kiểm tra tính hợp lệ của mật khẩu (chỉ check tồn tại).
   * @returns {boolean}
   */
  private isPasswordValid(): boolean {
    // Đăng nhập không nên check Regex phức tạp, chỉ cần có nhập là được
    return !!this.password && this.password.length > 0;
  }

  /**
   * Tác dụng: Alias để tương thích với các hàm validate cũ nếu cần.
   */
  public isPassword(): boolean {
    return this.isPasswordValid();
  }
}