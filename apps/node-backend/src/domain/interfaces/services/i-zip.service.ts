/**
 * @description Giao diện dịch vụ xử lý nén và giải nén (Dịch: Zip Service Interface)
 */
export interface IZipService {
  /**
   * Giải nén một tệp zip vào thư mục chỉ định
   * (Dịch: Extract a zip file to a specified directory)
   */
  extract(sourcePath: string, targetDir: string): Promise<void>;
  
  /**
   * Có thể mở rộng thêm các hàm như nén (compress) trong tương lai
   */
  cleanup(dirPath: string): Promise<void>
}