/**
 * @interface ITempStorageService
 * @description Quản lý lưu trữ tạm thời cho các tiến trình xử lý tập tin (Jobs).
 */
export interface ITempStorageService {
  /**
   * @description Khởi tạo thư mục tạm riêng cho một Job.
   * @param jobId ID của tiến trình.
   */
  createTempDir(jobId: string): Promise<void>;

  /**
   * @description Lưu một mảnh file (chunk) vào vùng nhớ tạm.
   * @param jobId ID của tiến trình.
   * @param index Thứ tự của mảnh file.
   * @param buffer Dữ liệu nhị phân của mảnh.
   */
  saveChunk(jobId: string, index: number, buffer: Buffer): Promise<void>;

  /**
   * @description Hợp nhất các mảnh đã lưu thành một file hoàn chỉnh.
   * @param jobId ID của tiến trình.
   * @param totalChunks Tổng số lượng mảnh.
   * @returns {Promise<string>} Đường dẫn đến file sau khi gộp.
   */
  mergeChunks(jobId: string, totalChunks: number): Promise<string>;

  /**
   * @description Xóa toàn bộ dữ liệu tạm liên quan đến Job để giải phóng bộ nhớ.
   * @param jobId ID của tiến trình.
   */
  cleanup(jobId: string): Promise<void>;

  /**
   * @description Lấy đường dẫn tuyệt đối đến thư mục hoặc file tạm của Job.
   * @param subPath Đường dẫn con bổ sung (nếu có).
   */
  getTempPath(jobId: string, subPath?: string): string;

  /**
   * @description Liệt kê danh sách tên các tập tin có trong một thư mục.
   * @param folderPath Đường dẫn thư mục cần quét.
   */
  listFilesInFolder(folderPath: string): Promise<string[]>;

  /**
   * @description Đọc nội dung của một tập tin cụ thể dưới dạng Buffer.
   * @param folderPath Đường dẫn thư mục chứa file.
   * @param fileName Tên tập tin cần đọc.
   */
  readFile(folderPath: string, fileName: string): Promise<Buffer>;
}