/**
 * @interface IImportQueue
 * @description Interface định nghĩa các phương thức tương tác với hàng đợi xử lý Import.
 * Sử dụng để đẩy các tiến trình xử lý file (như ZIP) vào hàng đợi chạy ngầm (Background Jobs).
 */
export interface IImportQueue {
  
  /**
   * @description Thêm một yêu cầu Import mới vào hàng đợi xử lý.
   * * @param jobId - Định danh duy nhất của tiến trình Import (thường lấy từ ImportJobEntity).
   * @param zipPath - Đường dẫn vật lý của file ZIP đã được upload lên Server.
   * @returns {Promise<void>} Trả về Promise hoàn thành khi Job đã được enqueue thành công.
   */
  addImportJob(jobId: string, zipPath: string): Promise<void>;

  /**
   * @description Đóng kết nối với hệ thống hàng đợi (Redis/BullMQ).
   * Thường được gọi khi ứng dụng tắt (Graceful Shutdown) để giải phóng tài nguyên.
   * * @returns {Promise<void>}
   */
  close(): Promise<void>;
}