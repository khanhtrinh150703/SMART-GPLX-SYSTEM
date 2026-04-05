import { REGEX } from '@/domain/constants/regex.constant';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * Data Transfer Object cho việc cập nhật Hạng bằng lái.
 */
export class UpdateLicenseCategoryRequestDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;

  /**
   * Khởi tạo DTO từ dữ liệu nhận được.
   */
  constructor(data: Partial<UpdateLicenseCategoryRequestDTO>) {
    if (!data.id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }
    this.id = data.id;
    this.name = data.name?.trim() || "";
    this.description = data.description?.trim() || "";
    this.minAge = data.minAge ?? 18;
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