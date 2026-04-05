/**
 * @description DTO chứa dữ liệu yêu cầu đăng nhập hệ thống (Credentials).
 * Đảm nhận vai trò kiểm tra tính hiện diện và định dạng cơ bản của thông tin định danh trước khi đẩy vào tầng nghiệp vụ.
 */
export class LoginRequestDTO {
  /** @property {string} username - Tên đăng nhập hoặc Email của người dùng. */
  readonly username!: string;

  /** @property {string} password - Mật khẩu chưa mã hóa (Plain text) gửi từ Client. */
  readonly password!: string;

  /**
   * @description Khởi tạo DTO từ dữ liệu thô (Partial data).
   * @param {Partial<LoginRequestDTO>} data - Dữ liệu trích xuất từ request body.
   */
  constructor(data: Partial<LoginRequestDTO>) {
    Object.assign(this, data);
  }

  /**
   * @description Kiểm tra tổng thể tính hợp lệ của thông tin đăng nhập.
   * Đối với Login, chúng ta chỉ tập trung kiểm tra việc dữ liệu không được để trống.
   * @returns {boolean} Trả về true nếu tất cả các trường bắt buộc đã được nhập đầy đủ.
   */
  public isValid(): boolean {
    return this.isUsernameValid() && this.isPasswordValid();
  }

  /**
   * @description Kiểm tra tính hợp lệ của tên đăng nhập (Không được trống và đã loại bỏ khoảng trắng).
   * @private
   * @returns {boolean}
   */
  private isUsernameValid(): boolean {
    return !!this.username && this.username.trim().length > 0;
  }

  /**
   * @description Kiểm tra sự hiện diện của mật khẩu. 
   * Lưu ý: Tại bước đăng nhập, không nên kiểm tra Regex phức tạp để tránh lộ quy tắc mật khẩu cho kẻ tấn công.
   * @private
   * @returns {boolean}
   */
  private isPasswordValid(): boolean {
    return !!this.password && this.password.length > 0;
  }

  /**
   * @description Hàm bí danh (Alias) nhằm duy trì tính tương thích với các logic kiểm tra mật khẩu hiện có.
   * @returns {boolean}
   */
  public isPassword(): boolean {
    return this.isPasswordValid();
  }
}