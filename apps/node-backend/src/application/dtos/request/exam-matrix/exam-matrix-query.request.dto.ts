import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @class ExamMatrixQueryDTO
 * @description DTO xử lý truy vấn danh sách Ma trận đề thi.
 * @description English: Data Transfer Object for Exam Matrix queries.
 */
export class ExamMatrixQueryDTO extends BaseQueryDTO {
  public readonly name?: string;
  public readonly licenseCategoryName?: string;
  public readonly totalQuestions?: number;
  public readonly passingScore?: number;
  public readonly durationMinutes?: number;
  public readonly minCriticalQuestions?: number;
  public readonly isChapter?: boolean;

  /**
   * @param {Record<string, unknown>} data
   */
  constructor(data: Record<string, unknown>) {
    super();

    // 1. Phân trang & Sắp xếp (Kế thừa và chuẩn hóa từ BaseQueryDTO)
    this.page = data.page ? Math.max(1, Number(data.page)) : 1;
    this.limit = data.limit ? Math.max(1, Number(data.limit)) : 10;
    this.sortBy =
      typeof data.sortBy === "string" ? data.sortBy.trim() : "createdAt";
    this.sortOrder = data.sortOrder === "asc" ? "asc" : "desc";
    this.status =
      typeof data.status === "string" ? data.status.trim() : undefined;
    this.search =
      typeof data.search === "string" ? data.search.trim() : undefined;

    // 2. Lọc chuỗi (String Sanitization)
    this.name = typeof data.name === "string" ? data.name.trim() : undefined;
    this.licenseCategoryName =
      typeof data.licenseCategoryName === "string"
        ? data.licenseCategoryName.trim()
        : undefined;

    // 3. Ép kiểu số an toàn (Dùng undefined thay vì NaN để không filter nhầm dữ liệu trống)
    this.totalQuestions =
      data.totalQuestions !== undefined &&
      data.totalQuestions !== null &&
      data.totalQuestions !== ""
        ? Number(data.totalQuestions)
        : undefined;
    this.passingScore =
      data.passingScore !== undefined &&
      data.passingScore !== null &&
      data.passingScore !== ""
        ? Number(data.passingScore)
        : undefined;
    this.durationMinutes =
      data.durationMinutes !== undefined &&
      data.durationMinutes !== null &&
      data.durationMinutes !== ""
        ? Number(data.durationMinutes)
        : undefined;
    this.minCriticalQuestions =
      data.minCriticalQuestions !== undefined &&
      data.minCriticalQuestions !== null &&
      data.minCriticalQuestions !== ""
        ? Number(data.minCriticalQuestions)
        : undefined;

    // 4. Lọc kiểu Boolean (Hỗ trợ bóc tách cả chuỗi "true"/"false" gửi lên từ Express Query)
    this.isChapter =
      data.isChapter === true || data.isChapter === "true"
        ? true
        : data.isChapter === false || data.isChapter === "false"
          ? false
          : undefined;
  }
}
