import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo mới Hạng bằng lái.
 */
export interface ICreateLicenseCategoryInputDTO {
  readonly id?: string;
  readonly name: string;
  readonly description: string;
  readonly minAge: number;
  readonly orderIndex: number;
}

/**
 * @description DTO xử lý tạo mới Hạng bằng lái.
 */
export class CreateLicenseCategoryRequestDTO implements ICreateLicenseCategoryInputDTO {
  public readonly id?: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;

  constructor(data: ICreateLicenseCategoryInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // --- 1. LÀM SẠCH DỮ LIỆU TRƯỚC (Normalize First) ---
    this.id = typeof data.id === "string" ? data.id.trim() : "";

    this.name =
      typeof data.name === "string" ? data.name.trim().toUpperCase() : "";

    this.description =
      typeof data.description === "string" ? data.description.trim() : "";
    this.minAge =
      data.minAge !== undefined && data.minAge !== null
        ? Number(data.minAge)
        : NaN;

    this.orderIndex =
      data.orderIndex !== undefined && data.orderIndex !== null
        ? Number(data.orderIndex)
        : 0;

    // --- 2. KIỂM TRA DỮ LIỆU SAU (Validate Self) ---
    this.validate();
  }

  /**
   * @description Hàm gác cổng check 100% logic của Trinh trên dữ liệu đã sạch.
   * @private
   */
  private validate(): void {
    const { LICENSE } = ErrorCode;

    // 1. Kiểm tra Tên hạng bằng (Sử dụng this.name đã lowercase)
    if (this.name.length === 0) {
      throw new AppError(LICENSE.NAME_REQUIRED);
    }

    if (this.name.length > 10) {
      throw new AppError(LICENSE.NAME_INVALID_LENGTH);
    }

    // LIC_103: Regex này sẽ PASS vì name đã được lowercase
    if (!REGEX.LICENSE.NAME_FORMAT.test(this.name)) {
      throw new AppError(LICENSE.NAME_FORMAT_INVALID);
    }

    // 2. Kiểm tra Độ tuổi (LIC_105)
    if (isNaN(this.minAge)) {
      throw new AppError(LICENSE.AGE_REQUIRED);
    }

    if (this.minAge < 18) {
      throw new AppError(LICENSE.AGE_INVALID);
    }

    // 3. Kiểm tra Mô tả (LIC_106, LIC_107)
    if (this.description.length === 0) {
      throw new AppError(LICENSE.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(LICENSE.DESCRIPTION_TOO_LONG);
    }

    // 4. Kiểm tra Thứ tự sắp xếp (LIC_108)
    if (this.orderIndex < 0) {
      throw new AppError(LICENSE.INVALID_ORDER);
    }
  }
}
