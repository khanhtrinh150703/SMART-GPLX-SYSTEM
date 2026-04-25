/**
 * @interface ITokenRepository
 * @description Định nghĩa các thao tác hạ tầng (Low-level) với Redis để quản lý vòng đời của Token.
 * Tập trung vào các thao tác Nguyên tử (Atomic): Đọc, Ghi và Truy vấn theo Key/Pattern.
 */
export interface ITokenRepository {
  /**
   * @description Lưu trữ Token vào Redis kèm thời gian hết hạn (TTL).
   * @param key Định dạng khóa lưu trữ (e.g., `auth:refreshtoken:{userId}:{deviceId}`).
   * @param value Giá trị Token cần lưu trữ.
   * @param ttlSeconds Thời gian sống của key tính bằng giây.
   */
  save(key: string, value: string, ttlSeconds: number): Promise<void>;

  /**
   * @description Truy xuất giá trị Token từ kho lưu trữ theo khóa định danh.
   * @param key Khóa cần truy vấn.
   * @returns Trả về chuỗi Token hoặc null nếu key đã hết hạn/không tồn tại.
   */
  get(key: string): Promise<string | null>;

  /**
   * @description Thu hồi (Xóa) một khóa cụ thể khỏi hệ thống.
   * @param key Khóa định danh của Token cần xóa.
   */
  delete(key: string): Promise<void>;

  /**
   * @description Xóa hàng loạt khóa dựa trên mẫu (Pattern). Thường dùng cho chức năng Đăng xuất tất cả thiết bị.
   * @param pattern Chuỗi pattern tìm kiếm (e.g., `auth:token:{userId}:*`).
   */
  deleteByPattern(pattern: string): Promise<void>;

  /**
   * @description Kiểm tra sự tồn tại của khóa trong kho lưu trữ.
   * @param key Khóa cần kiểm tra.
   */
  exists(key: string): Promise<boolean>;
}