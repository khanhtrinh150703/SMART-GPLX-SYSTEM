import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @description Các tiêu chí tìm kiếm và lọc bổ sung khi tìm bài thi.
 * English: Additional search and filter criteria for finding exams.
 */
export interface IExamUserFilterOptions {
  readonly search?: string; // Tìm kiếm đơn giản theo tên bài thi
  readonly licenseCode?: string; // Lọc theo hạng bằng lái
}

/**
 * @description DTO bóc tách tham số truy vấn từ phía người dùng (User/Học viên).
 * Chuyển đổi và làm sạch dữ liệu từ URL Query trước khi đưa vào hệ thống.
 */
export class ExamUserQueryDTO
  extends BaseQueryDTO
  implements IExamUserFilterOptions
{
  public licenseCode?: string;

  /**
   * @param data - Dữ liệu thô từ req.query được ép kiểu Partial.
   */
  constructor(data: Partial<ExamUserQueryDTO>) {
    super(data);

    // 1. Gán dữ liệu thô vào instance (Ghi đè các giá trị mặc định của Base nếu có)
    Object.assign(this, data);

    /**
     * THỰC HIỆN ÉP KIỂU THỦ CÔNG (Manual Casting)
     * Chuyển đổi từ String (URL Params) về đúng kiểu dữ liệu nghiệp vụ.
     */

    // 2. Ép kiểu cho các thuộc tính kế thừa từ BaseQueryDTO
    if (this.page) this.page = Number(this.page);
    if (this.limit) this.limit = Number(this.limit);

    // 3. Normalization cho các chuỗi tìm kiếm/Lọc (Dịch: Normalizing search/filter strings)
    if (this.search) {
      this.search = String(this.search).trim();
    }

    if (this.licenseCode) {
      this.licenseCode = String(this.licenseCode).trim();
    }
  }
}
