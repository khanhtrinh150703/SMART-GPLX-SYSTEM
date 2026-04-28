import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @description DTO dùng để lọc danh sách Ma trận đề thi theo cơ chế Dynamic Search.
 * Chỉ nhận một giá trị search và một trường activeField chỉ định.
 */
export class ExamMatrixQueryDTO extends BaseQueryDTO {
  /** @description Tên trường dữ liệu cần tìm (Lấy từ Dropdown Filter) */
  public activeField?: string;

  constructor(data: Partial<ExamMatrixQueryDTO>) {
    super();

    // Gán dữ liệu thô từ Query String vào Class
    Object.assign(this, data);

    // Ép kiểu cho các thuộc tính phân trang kế thừa từ BaseQueryDTO
    if (this.limit) this.limit = Number(this.limit);
    if (this.page) this.page = Number(this.page);
  }
}