import { QueryParams } from "@/types/paginaton.type";

export interface ExamQueryParams extends QueryParams {
  name?: string;
  licenseCategoryName?: string;
  totalQuestions?: number;
  status?: string;
  score?: number;
  startedAt?: string; // Dùng string để truyền định dạng ISO từ URL
}
