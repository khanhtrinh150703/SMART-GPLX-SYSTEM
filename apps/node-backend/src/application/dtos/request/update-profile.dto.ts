import { IUploadedFile } from '../../../shared/types/file.type';

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