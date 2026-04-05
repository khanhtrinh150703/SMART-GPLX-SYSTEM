import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Giao diện định nghĩa các dịch vụ lưu trữ tệp tin (File Storage Services).
 * Đóng vai trò là lớp trừu tượng (Abstraction Layer) giúp hệ thống hoán đổi linh hoạt giữa các giải pháp lưu trữ
 * như: Local Disk, Amazon S3, Google Cloud Storage hoặc Cloudinary mà không ảnh hưởng đến tầng nghiệp vụ.
 */
export interface IFileStorageService {

  /**
   * @description Thực hiện lưu bền vững tệp tin vào bộ nhớ vật lý hoặc đám mây và trả về đường dẫn truy cập.
   * @param {IUploadedFile} file - Đối tượng tệp tin chứa dữ liệu thô (Buffer/Stream) và thông tin siêu dữ liệu (Metadata).
   * @param {string} folder - Tên thư mục hoặc đường dẫn đích để phân loại tệp tin (VD: 'avatars', 'license-categories').
   * @returns {Promise<string>} Đường dẫn (URL) hoặc mã định danh của tệp tin sau khi đã được lưu trữ thành công.
   */
  saveFile(file: IUploadedFile, folder: string): Promise<string>;
}