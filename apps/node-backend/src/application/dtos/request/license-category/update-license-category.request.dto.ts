import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật hạng bằng lái.
 */
export interface IUpdateLicenseCategoryInputDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly minAge: number;
  readonly orderIndex: number;
}

/**
 * @class UpdateLicenseCategoryRequestDTO
 * @description DTO xử lý cập nhật hạng giấy phép lái xe, mapping trước khi validate.
 */
export class UpdateLicenseCategoryRequestDTO implements IUpdateLicenseCategoryInputDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;

  /**
   * @param {IUpdateLicenseCategoryInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IUpdateLicenseCategoryInputDTO) {
    // 0. Guard Clause cho đầu vào
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Gán và chuẩn hóa dữ liệu)
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

    // 2. Validate dữ liệu đã được gán vào instance
    this.validate(data);
  }

  /**
   * @private
   * @description Hàm gác cổng giữ nguyên các trường hợp kiểm tra của hệ thống.
   * @param {IUpdateLicenseCategoryInputDTO} data - Dùng để check các trường undefined/null nguyên bản
   * @throws {AppError}
   */
  private validate(data: IUpdateLicenseCategoryInputDTO): void {
    // 1. Kiểm tra ID bắt buộc
    if (!this.id || this.id.trim() === "") {
      throw new AppError(ErrorCode.LICENSE.ID_REQUIRED);
    }

    // 2. Kiểm tra Tên hạng bằng (Name)
    if (this.name === "") {
      throw new AppError(ErrorCode.LICENSE.NAME_REQUIRED);
    }

    if (this.name.length > 10) {
      throw new AppError(ErrorCode.LICENSE.NAME_INVALID_LENGTH);
    }

    if (!REGEX.LICENSE.NAME_FORMAT.test(this.name)) {
      throw new AppError(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
    }

    // 3. Kiểm tra Độ tuổi tối thiểu (Min Age)
    if (
      data.minAge === undefined ||
      data.minAge === null ||
      isNaN(this.minAge)
    ) {
      throw new AppError(ErrorCode.LICENSE.AGE_REQUIRED);
    }

    if (this.minAge < 18) {
      throw new AppError(ErrorCode.LICENSE.AGE_INVALID);
    }

    // 4. Kiểm tra Thứ tự hiển thị và Mô tả
    if (data.orderIndex !== undefined && this.orderIndex < 0) {
      throw new AppError(ErrorCode.LICENSE.INVALID_ORDER);
    }

    if (this.description === "") {
      throw new AppError(ErrorCode.LICENSE.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(ErrorCode.LICENSE.DESCRIPTION_TOO_LONG);
    }
  }
}
