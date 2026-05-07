import { REGEX } from '@/domain/constants/regex.constant';
import { AppError, ErrorCode } from '@/shared/errors';

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
 * @description DTO xử lý cập nhật thông tin hạng giấy phép lái xe (VD: A1, B2, C...).
 * Đảm bảo các ràng buộc về độ tuổi và định dạng tên hạng bằng ngay khi khởi tạo.
 */
export class UpdateLicenseCategoryRequestDTO implements IUpdateLicenseCategoryInputDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;

  constructor(data: IUpdateLicenseCategoryInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại "cửa ngõ"
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu (Sanitization)
    this.id = data.id;
    this.name = data.name.trim();
    this.description = data.description.trim();
    this.minAge = Number(data.minAge);
    this.orderIndex = Number(data.orderIndex);
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ của hạng bằng lái.
   * @private
   */
  private validate(data: IUpdateLicenseCategoryInputDTO): void {
    // Guard Clause
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Kiểm tra ID bắt buộc
    if (!data.id || data.id.trim() === '') {
      throw new AppError(ErrorCode.LICENSE.ID_REQUIRED);
    }

    // 2. Kiểm tra Tên hạng bằng (Name)
    const trimmedName = data.name?.trim() || '';
    if (trimmedName === '') {
      throw new AppError(ErrorCode.LICENSE.NAME_REQUIRED);
    }

    if (trimmedName.length > 10) {
      throw new AppError(ErrorCode.LICENSE.NAME_INVALID_LENGTH);
    }

    if (!REGEX.LICENSE.NAME_FORMAT.test(trimmedName)) {
      throw new AppError(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
    }

    // 3. Kiểm tra Độ tuổi tối thiểu (Min Age)
    if (data.minAge === undefined || data.minAge === null || isNaN(Number(data.minAge))) {
      throw new AppError(ErrorCode.LICENSE.AGE_REQUIRED);
    }

    if (Number(data.minAge) < 18) {
      throw new AppError(ErrorCode.LICENSE.AGE_INVALID);
    }

    // 4. Kiểm tra Thứ tự hiển thị và Mô tả
    if (data.orderIndex !== undefined && Number(data.orderIndex) < 0) {
      throw new AppError(ErrorCode.LICENSE.INVALID_ORDER);
    }

    const trimmedDesc = data.description?.trim() || '';
    if (trimmedDesc === '') {
      throw new AppError(ErrorCode.LICENSE.DESCRIPTION_REQUIRED);
    }

    if (trimmedDesc.length > 500) {
      throw new AppError(ErrorCode.LICENSE.DESCRIPTION_TOO_LONG);
    }
  }
}