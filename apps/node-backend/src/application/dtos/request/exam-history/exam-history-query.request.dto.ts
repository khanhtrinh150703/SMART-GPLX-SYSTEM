import {
  BaseQueryDTO,
  IBaseQueryDTO,
} from "@/shared/types/common-query.dto.types";

/**
 * @interface IExamHistoryQueryDTO
 * @description Giao diện truy vấn lịch sử thi tối giản.
 * English: Minimalist interface for exam history queries.
 */
export interface IExamHistoryQueryDTO extends IBaseQueryDTO {
  userId?: string;
}

/**
 * @class ExamHistoryQueryDTO
 * @extends BaseQueryDTO
 * @description DTO xử lý truy vấn lịch sử thi tập trung vào tìm kiếm và phân trang.
 * @principle Clean & Fast - Chỉ giữ lại những gì thực sự cần thiết để tối ưu tốc độ.
 */
export class ExamHistoryQueryDTO
  extends BaseQueryDTO
  implements IExamHistoryQueryDTO
{
  public readonly userId?: string;

  /**
   * @description Khởi tạo và chuẩn hóa dữ liệu.
   * @param data - Dữ liệu thô từ req.query.
   */
  constructor(data: Partial<ExamHistoryQueryDTO>) {
    super(data);

    // 1. Phân trang kế thừa (Page & Limit)
    this.page = data.page ? Number(data.page) : 1;
    this.limit = data.limit ? Number(data.limit) : 10;

    // 2. Định danh người dùng (Sanitize string)
    this.userId =
      typeof data.userId === "string" ? data.userId.trim() : undefined;

    // 3. Xử lý Search Keyword
    // Loại bỏ khoảng trắng thừa để tránh lỗi query "  "
    this.search =
      typeof data.search === "string" ? data.search.trim() : undefined;
  }
}
