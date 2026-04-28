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
  public readonly orderIndex: number;

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
    this.orderIndex = data.orderIndex ?? 1;
  }


  /**
   * Kiểm tra tính hợp lệ của dữ liệu cập nhật.
   * @throws {AppError}
   */
  public isValid(): void {
    if (!this.id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }
    // 1. Kiểm tra Tên hạng bằng (Name Validation)
    if (!this.name) {
      throw new AppError(ErrorCode.VALIDATION.NAME_REQUIRED);
    }

    if (this.name.length < 1 || this.name.length > 10) {
      throw new AppError(ErrorCode.VALIDATION.NAME_INVALID_LENGTH);
    }

    if (this.minAge === undefined || this.minAge === null || typeof this.minAge !== 'number' || Number.isNaN(this.minAge)) {
      throw new AppError(ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER); // "Độ tuổi phải là một con số hợp lệ."
    }

    if (this.minAge < 18) {
      throw new AppError(ErrorCode.VALIDATION.AGE_INVALID); // "Độ tuổi tối thiểu không được nhỏ hơn 18."
    }

    if (this.orderIndex < 0) {
      throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER); 
    }

    // Kiểm tra định dạng bằng Regex (VD: A1, B1, B2...)
    if (!REGEX.LICENSE.NAME_FORMAT.test(this.name)) {
      throw new AppError(ErrorCode.VALIDATION.NAME_FORMAT_INVALID);
    }

    // 2. Kiểm tra Mô tả (Description Validation)
    if (!this.description) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
    }
  }
}