import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

export class ChapterQueryDTO extends BaseQueryDTO {
  public name?: string;
  public orderIndex?: number;
  public description?: string;
  public code?: string;

  constructor(data: Partial<ChapterQueryDTO>) {
    super(data);

    // 1. Gán dữ liệu thô (Object.assign vẫn ổn nhưng gán tường minh sẽ an toàn kiểu dữ liệu hơn)
    Object.assign(this, data);

    // 2. Chuẩn hóa chuỗi (Normalization) - Chỉ thực hiện nếu có dữ liệu
    this.name = typeof data.name === "string" ? data.name.trim() : "";

    this.code =
      typeof data.code === "string" ? data.code.trim().toLowerCase() : "";

    this.description =
      typeof data.description === "string" ? data.description.trim() : "";

    // 3. Ép kiểu số (Type Casting)
    if (this.orderIndex !== undefined)
      this.orderIndex = Number(this.orderIndex);
    if (this.limit !== undefined) this.limit = Number(this.limit);
    if (this.page !== undefined) this.page = Number(this.page);
  }
}
