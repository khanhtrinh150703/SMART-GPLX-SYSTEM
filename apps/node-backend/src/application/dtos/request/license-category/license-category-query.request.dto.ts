import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

// features/license/dto/license-query.dto.ts
export class LicenseCategoryQueryDTO extends BaseQueryDTO {
  // Thêm các field lọc đặc thù vào đây
  public name?: string;
  public minAge?: number;
  public description?: string;

  constructor(data: Partial<LicenseCategoryQueryDTO>) {
    super(); // Gọi constructor của BaseQueryDTO

    // Gán dữ liệu thô vào class
    Object.assign(this, data);

    // Bắt đầu ép kiểu thủ công tại đây:
    if (this.minAge) this.minAge = Number(this.minAge);

    // Đừng quên ép kiểu cho các thuộc tính kế thừa từ BaseQueryDTO nếu cần
    if (this.limit) this.limit = Number(this.limit);
    if (this.page) this.page = Number(this.page);
  }
}