/**
 * Interface định nghĩa các thao tác thô với kho lưu trữ Token (Redis).
 * Chỉ tập trung vào việc Đọc/Ghi/Xóa theo Key.
 */
export interface ITokenRepository {
  /**
   * Tác dụng: Lưu trữ giá trị vào kho với thời gian hết hạn.
   * @param {string} key - Khóa lưu trữ (ví dụ: auth:token:userId:deviceId).
   * @param {string} value - Giá trị cần lưu (thường là AccessToken hoặc RefreshToken).
   * @param {number} ttlSeconds - Thời gian sống của key (giây).
   * @returns {Promise<void>}
   */
  save(key: string, value: string, ttlSeconds: number): Promise<void>;

  /**
   * Tác dụng: Lấy giá trị từ kho theo khóa.
   * @param {string} key - Khóa cần tìm.
   * @returns {Promise<string | null>}
   */
  get(key: string): Promise<string | null>;

  /**
   * Tác dụng: Xóa bỏ một khóa cụ thể trong kho.
   * @param {string} key - Khóa cần xóa.
   */
  delete(key: string): Promise<void>;

  /**
   * Tác dụng: Xóa nhiều khóa theo pattern (Dùng cho Logout All).
   * @param {string} pattern - Mẫu khóa (ví dụ: auth:token:userId:*).
   */
  deleteByPattern(pattern: string): Promise<void>;

  exists(key: string): Promise<boolean>;
}