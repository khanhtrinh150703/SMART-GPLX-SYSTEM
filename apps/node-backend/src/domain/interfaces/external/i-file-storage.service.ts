import { StorageFolder } from "@/domain/constants/storage.constant";
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
   * @param {StorageFolder} folder - Thư mục đích (profiles/questions/...)
   * @returns {Promise<string>} Đường dẫn (URL) hoặc mã định danh của tệp tin sau khi đã được lưu trữ thành công.
   */
  saveFile(file: IUploadedFile, folder: StorageFolder): Promise<string>;

  /**
   * @description Xóa tệp tin khỏi bộ nhớ
   * @param {string} relativePath - Đường dẫn tương đối cần xóa
   * @returns {Promise<void>}
   */
  deleteFile(relativePath: string): Promise<void>;

  /**
   * @description Lưu tệp tin từ một đường dẫn tạm thời trên hệ thống vào thư mục lưu trữ chính thức.
   * @param {string} localPath - Đường dẫn vật lý của tệp tin tạm (Ví dụ: 'temp/unzipped/image.png')
   * @param {string} folder - Tên thư mục đích bên trong kho lưu trữ (Ví dụ: 'questions', 'avatars')
   * @returns {Promise<string>} - Trả về đường dẫn tương đối sau khi lưu (Ví dụ: '/uploads/questions/uuid.png')
   */
  saveFromLocalPath(localPath: string, folder: string): Promise<string>;
} 