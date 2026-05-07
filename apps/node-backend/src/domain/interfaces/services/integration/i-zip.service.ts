/**
 * @interface IZipService
 * @description Dịch vụ xử lý tập tin nén. 
 * Cung cấp các phương thức để quản lý việc giải nén và dọn dẹp tài nguyên tạm thời.
 */
export interface IZipService {
  
  /**
   * @description Giải nén tệp tin ZIP từ đường dẫn nguồn vào thư mục đích.
   * @param sourcePath - Đường dẫn vật lý đến file .zip nguồn.
   * @param targetDir - Đường dẫn thư mục đích nơi dữ liệu sẽ được giải nén vào.
   * @returns {Promise<void>} Hoàn thành khi toàn bộ dữ liệu đã được giải nén thành công.
   */
  extract(sourcePath: string, targetDir: string): Promise<void>;

  /**
   * @description Dọn dẹp tài nguyên (xóa file hoặc thư mục) sau khi hoàn thành xử lý.
   * Giúp tối ưu hóa dung lượng ổ cứng và bảo mật thông tin tạm thời.
   * @param targetPath - Đường dẫn vật lý của file hoặc thư mục cần xóa.
   * @returns {Promise<void>}
   */
  cleanup(targetPath: string): Promise<void>;
}