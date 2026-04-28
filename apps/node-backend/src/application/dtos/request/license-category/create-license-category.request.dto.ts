import { REGEX } from "@/domain/constants/regex.constant";
import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * Data Transfer Object cho việc tạo mới Hạng bằng lái.
 * Sử dụng cho việc nhận và kiểm tra dữ liệu từ Request Body.
 */
export class CreateLicenseCategoryRequestDTO {
  public readonly id?: string; // ID thường là optional khi tạo mới (DB tự gen)
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;

  /**
   * Constructor nhận vào dữ liệu thô để khởi tạo object.
   * Thực hiện trim() dữ liệu ngay từ đầu để tránh lỗi khoảng trắng.
   */
  constructor(data: Partial<CreateLicenseCategoryRequestDTO>) {
    this.id = data.id;
    this.name = data.name?.trim() || "";
    this.description = data.description?.trim() || "";
    this.minAge = data.minAge ?? 18;
    this.orderIndex = data.orderIndex ?? 1;
  }

  /**
   * Kiểm tra tính hợp lệ của dữ liệu đầu vào.
   * Tự động lookup Message và Status Code thông qua ValidationError.
   * @throws {AppError}
   */
  public isValid(): void {
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