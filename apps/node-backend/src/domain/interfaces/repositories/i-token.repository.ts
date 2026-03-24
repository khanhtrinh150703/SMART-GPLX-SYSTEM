/**
 * Interface định nghĩa các thao tác thô với kho lưu trữ Token (Redis).
 */
export interface ITokenRepository {
  /**
   * Tác dụng: Lưu trữ một giá trị chuỗi vào kho theo khóa và thời gian hết hạn.
   * @param {string} key - Khóa lưu trữ (ví dụ: userId).
   * @param {string} token - Giá trị token cần lưu.
   * @param {number} ttl - Thời gian sống của token (giây).
   * @returns {Promise<void>}
   */
  saveToken(key: string, token: string, ttl: number): Promise<void>;

  /**
   * Tác dụng: Lấy giá trị từ kho theo khóa.
   * @param {string} key - Khóa cần tìm.
   * @returns {Promise<string | null>}
   */
  getToken(key: string): Promise<string | null>;

  /**
   * Tác dụng: Xóa bỏ dữ liệu trong kho (dùng cho Logout).
   */
  deleteToken(key: string): Promise<void>;
}