import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";
import { ExamStatus } from "@prisma/client";

/**
 * @description DTO dùng để lọc và phân trang danh sách đề thi (Exam).
 */
export class ExamQueryDTO extends BaseQueryDTO {
  // Các trường lọc đặc thù từ Schema Exam
  public name?: string;
  public userId?: string;
  public licenseCategoryId?: string;
  public examMatrixId?: string;
  public statusExam?: ExamStatus;
  public isPassed?: boolean;

  // Các trường số (Integer trong Prisma)
  public totalQuestions?: number;
  public score?: number;

  constructor(data: Partial<ExamQueryDTO>) {
    super();

    // Gán dữ liệu thô vào instance
    Object.assign(this, data);

    /**
     * THỰC HIỆN ÉP KIỂU THỦ CÔNG (Manual Casting)
     * Đảm bảo Zero-Any và Type-Safety khi làm việc với Query Params (luôn là string)
     */

    // 1. Ép kiểu cho các thuộc tính kế thừa từ BaseQueryDTO
    if (this.page) this.page = Number(this.page);
    if (this.limit) this.limit = Number(this.limit);

    // 2. Ép kiểu cho các trường Integer đặc thù của Exam
    if (this.totalQuestions) this.totalQuestions = Number(this.totalQuestions);
    if (this.score) this.score = Number(this.score);

    // 3. Xử lý ép kiểu Boolean cho isPassed
    // Vì query param truyền lên thường là chuỗi "true" hoặc "false"
    if (this.isPassed !== undefined) {
      this.isPassed = String(this.isPassed).toLowerCase() === 'true';
    }

    // 4. Normalization cho các chuỗi tìm kiếm/ID
    if (this.name) this.name = this.name.trim();
    if (this.userId) this.userId = this.userId.trim();
    if (this.licenseCategoryId) this.licenseCategoryId = this.licenseCategoryId.trim();
    if (this.examMatrixId) this.examMatrixId = this.examMatrixId.trim();
  }
}