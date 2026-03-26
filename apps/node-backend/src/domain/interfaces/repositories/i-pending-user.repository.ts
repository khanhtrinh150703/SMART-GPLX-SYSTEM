/**
 * Giao diện quản lý dữ liệu người dùng tạm thời (Staging Area).
 * Mục đích: Lưu trữ thông tin đăng ký (Email, Password đã hash,...) trong thời gian chờ xác thực OTP.
 * Tránh việc khởi tạo bản ghi chưa xác thực vào cơ sở dữ liệu chính (MySQL).
 */
export interface IPendingUserRepository {
  /**
   * Tác dụng: Lưu trữ dữ liệu thô (thường là JSON string) vào kho tạm.
   * @param {string} key - Khóa định danh (Ví dụ: pending:user:email@gmail.com).
   * @param {string} data - Chuỗi dữ liệu thông tin người dùng.
   * @param {number} ttlSeconds - Thời gian tồn tại của dữ liệu (giây).
   * @returns {Promise<void>}
   */
  save(key: string, data: string, ttlSeconds: number): Promise<void>;

  /**
   * Tác dụng: Truy xuất dữ liệu tạm thời để chuẩn bị chuyển đổi thành User chính thức.
   * @param {string} key - Khóa định danh cần tìm.
   * @returns {Promise<string | null>} - Trả về dữ liệu dạng chuỗi hoặc null nếu hết hạn/không tồn tại.
   */
  get(key: string): Promise<string | null>;

  /**
   * Tác dụng: Xóa dữ liệu tạm sau khi người dùng đã xác thực thành công hoặc hủy bỏ.
   * @param {string} key - Khóa định danh cần xóa.
   * @returns {Promise<void>}
   */
  delete(key: string): Promise<void>;
}