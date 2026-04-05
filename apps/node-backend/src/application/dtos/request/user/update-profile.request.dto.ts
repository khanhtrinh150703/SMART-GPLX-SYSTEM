import { IUploadedFile } from "@/shared/types/file.type";
import { IUpdateProfileInput} from "@/shared/types/file.type";
/**
 * Data Transfer Object cho việc cập nhật thông tin cá nhân
 */
export class UpdateProfileDTO {
  readonly fullName?: string;
  readonly pictureFile?: IUploadedFile; // Chuyển từ string sang object File

  constructor(data: Partial<UpdateProfileDTO>) {
    Object.assign(this, data);
  }

  /**
   * Kiểm tra tính hợp lệ sơ bộ của DTO
   * @returns {boolean}
   */
  isValid(): boolean {
    // Thêm logic validate nếu cần (vd: fullName không được trống nếu có gửi lên)
    return true;
  }
}

/**
 * @description DTO chứa dữ liệu yêu cầu cập nhật hồ sơ cá nhân.
 * Hỗ trợ cập nhật từng phần (Partial Update) cho họ tên và tệp tin ảnh đại diện.
 */
export class UpdateProfileRequestDTO {
  /** @property {string} fullName - Họ và tên đầy đủ của người dùng (Tùy chọn). */
  readonly fullName?: string;

  /** @property {IUploadedFile} pictureFile - Đối tượng tệp tin ảnh đại diện mới (Tùy chọn). */
  readonly pictureFile?: IUploadedFile;

  /**
   * @description Khởi tạo DTO từ dữ liệu đầu vào của dịch vụ.
   * @param {IUpdateProfileInput} data - Dữ liệu trích xuất từ Multipart form-data.
   */
  constructor(data: IUpdateProfileInput) {
    this.fullName = data.fullName?.trim();
    this.pictureFile = data.pictureFile;
  }

  /**
   * @description Kiểm tra xem yêu cầu có chứa ít nhất một thông tin cần thay đổi hay không.
   * @returns {boolean} Trả về true nếu có dữ liệu hợp lệ để cập nhật.
   */
  public isValid(): boolean {
    return !!(this.fullName || this.pictureFile);
  }
}