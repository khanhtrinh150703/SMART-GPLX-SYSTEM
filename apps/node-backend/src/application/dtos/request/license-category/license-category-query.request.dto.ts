import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @description DTO xử lý truy vấn danh mục bằng lái.
 * @description English: Data Transfer Object for License Category queries.
 * @description Dịch: Đối tượng chuyển đổi dữ liệu cho các truy vấn hạng bằng lái.
 */
export class LicenseCategoryQueryDTO extends BaseQueryDTO {
  public minAge?: number;
  public description?: string;
  public name?: string;

  /**
   * @param {Partial<LicenseCategoryQueryDTO>} data
   */
  constructor(data: Partial<LicenseCategoryQueryDTO>) {
    super();

    // 1. Mapping & Sanitization chuỗi (Chỉ gán nếu là string thực thụ)
    this.name =
      typeof data.name === "string"
        ? data.name.trim().toUpperCase()
        : undefined;
    this.description =
      typeof data.description === "string"
        ? data.description.trim()
        : undefined;

    // 2. Ép kiểu số an toàn (Dùng undefined để không filter nhầm nếu trống)
    this.minAge =
      data.minAge !== undefined && data.minAge !== null
        ? Number(data.minAge)
        : undefined;

    // 3. Mapping các trường từ BaseQueryDTO (limit, page)
    if (this.limit !== undefined) this.limit = Number(this.limit);
    if (this.page !== undefined) this.page = Number(this.page);
  }
}
