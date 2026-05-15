import { QueryParams } from "@/types/paginaton.type";

/**
 * Định nghĩa các tham số truy vấn cho Ma trận đề thi 
 * (Query parameters definition for Exam Matrix)
 */
export interface ExamMatrixQueryParams extends QueryParams {
  // Các trường tìm kiếm động (Dynamic search fields)
  name?: string;
  licenseCategory?: string;
  totalQuestions?: number;
  passingScore?: number;
  durationMinutes?: number;
}