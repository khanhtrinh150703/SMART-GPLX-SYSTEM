import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @description DTO xử lý truy vấn danh sách câu hỏi cho Admin (Dịch: Admin question query DTO)
 */
export class QuestionsAdminQueryDto extends BaseQueryDTO {
  public readonly licenseCategoryIds?: string;
  public readonly chapterId?: string;
  public readonly difficultyLevel?: number;
  public readonly isCritical?: boolean;
  public readonly indexNumber?: boolean;

  constructor(data: Record<string, unknown>) {
    super();

    // 1. Phân trang & Sắp xếp (Kế thừa từ BaseQueryDTO)
    this.page = data.page ? Math.max(1, Number(data.page)) : 1;
    this.limit = data.limit ? Math.max(1, Number(data.limit)) : 10;
    this.sortBy = typeof data.sortBy === "string" ? data.sortBy : "createdAt";
    this.sortOrder = data.sortOrder === "asc" ? "asc" : "desc";
    this.status = typeof data.status === "string" ? data.status : undefined;
    // 2. Lọc cơ bản (String)
    this.licenseCategoryIds =
      typeof data.licenseCategoryIds === "string"
        ? data.licenseCategoryIds
        : undefined;
    this.chapterId =
      typeof data.chapterId === "string" ? data.chapterId : undefined;
    this.search = typeof data.search === "string" ? data.search : undefined;

    // 3. Ép kiểu Number & Boolean (Dịch: Explicit Casting)
    if (data.difficultyLevel !== undefined && data.difficultyLevel !== "") {
      this.difficultyLevel = Number(data.difficultyLevel);
    }

    if (data.indexNumber !== undefined && data.indexNumber !== "") {
      this.indexNumber = String(data.indexNumber).toLowerCase() === "true";
    }

    if (data.isCritical !== undefined && data.isCritical !== "") {
      this.isCritical = String(data.isCritical).toLowerCase() === "true";
    }
  }
}
