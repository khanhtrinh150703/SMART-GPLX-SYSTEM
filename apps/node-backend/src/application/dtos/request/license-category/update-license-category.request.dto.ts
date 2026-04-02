import { REGEX } from '@/domain/constants/regex.constant';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * Data Transfer Object cho việc cập nhật Hạng bằng lái.
 */
export class UpdateLicenseCategoryRequestDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;

  /**
   * Khởi tạo DTO từ dữ liệu nhận được.
   */
  constructor(data: { id: unknown; name: unknown; description: unknown }) {
    this.id = typeof data.id === 'string' ? data.id.trim() : '';
    this.name = typeof data.name === 'string' ? data.name.trim() : '';
    this.description = typeof data.description === 'string' ? data.description.trim() : '';
  }

  /**
   * Kiểm tra tính hợp lệ của dữ liệu cập nhật.
   * @throws {AppError}
   */
  public isValid(): void {
    if (!this.id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }

    if (!this.name) {
      throw new AppError(ErrorCode.VALIDATION.NAME_REQUIRED);
    }

    if (!REGEX.LICENSE.NAME_FORMAT.test(this.name)) {
      throw new AppError(ErrorCode.VALIDATION.NAME_FORMAT_INVALID);
    }

    if (!this.description) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
    }
  }
}