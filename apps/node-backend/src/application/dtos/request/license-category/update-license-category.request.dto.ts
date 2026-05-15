import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

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
 * @description DTO xử lý cập nhật hạng giấy phép lái xe, tự động chuẩn hóa và kiểm tra dữ liệu.
 */
export class UpdateLicenseCategoryRequestDTO implements IUpdateLicenseCategoryInputDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;

  constructor(data: IUpdateLicenseCategoryInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

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

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ đa tầng của hạng giấy phép lái xe dựa trên dữ liệu instance.
   */
  private validate(): void {
    if (!this.id || this.id === "") {
      throw new AppError(ErrorCode.LICENSE.ID_REQUIRED);
    }

    if (!isUUID(this.id)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (this.name === "") {
      throw new AppError(ErrorCode.LICENSE.NAME_REQUIRED);
    }

    if (this.name.length > 10) {
      throw new AppError(ErrorCode.LICENSE.NAME_INVALID_LENGTH);
    }

    if (!REGEX.LICENSE.NAME_FORMAT.test(this.name)) {
      throw new AppError(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
    }

    if (isNaN(this.minAge)) {
      throw new AppError(ErrorCode.LICENSE.AGE_REQUIRED);
    }

    if (this.minAge < 18) {
      throw new AppError(ErrorCode.LICENSE.AGE_INVALID);
    }

    if (isNaN(this.orderIndex) || this.orderIndex < 0) {
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
