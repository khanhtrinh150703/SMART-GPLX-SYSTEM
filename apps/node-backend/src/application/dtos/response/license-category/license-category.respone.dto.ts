/**
 * @description Giao diện dữ liệu trả về cho thông tin hạng bằng lái.
 * (Interface for responding with license category information.)
 */
export interface ILicenseCategoryResponseDTO {
  /** @description Mã định danh duy nhất (UUID). */
  readonly id: string;

  /** @description Tên hạng bằng (VD: A1, B2). */
  readonly name: string;

  /** @description Mô tả chi tiết về hạng bằng. */
  readonly description: string;

  /** @description Độ tuổi tối thiểu bắt buộc để được cấp hạng bằng này. */
  readonly minAge: number;

  /** @description Trạng thái hoạt động của hạng bằng (VD: 'active', 'draft', 'deleted'). */
  readonly status: string;

  /** @description Thứ tự hiện thị*/
  readonly orderIndex: number;

  /** @description Thời điểm tạo bản ghi (định dạng ISO 8601). */
  readonly createdAt: string | Date;
}

/**
 * @description DTO vận chuyển thông tin hạng bằng lái.
 * Cung cấp dữ liệu tinh gọn cho phía Client trong dự án Smart-GPLX-System.
 */
export class LicenseCategoryResponseDTO implements ILicenseCategoryResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly minAge: number;
  public readonly orderIndex: number;
  public readonly status: string;
  public readonly createdAt: string | Date;

  constructor(data: ILicenseCategoryResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.orderIndex = data.orderIndex;
    this.minAge = data.minAge;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}