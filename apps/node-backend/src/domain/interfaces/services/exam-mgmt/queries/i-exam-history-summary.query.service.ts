import { ExamHistorySummaryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-summary-query.request.dto";
import { ExamHistorySummaryResponseDTO } from "@/application/dtos/response/exam-history/exam-history-summary.response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @interface IExamHistorySummaryQueryService
 * @description Giao diện dịch vụ truy vấn (Read-only).
 */
export interface IExamHistorySummaryQueryService {
  /**
   * @description Truy xuất danh sách lịch sử thi dựa trên bộ lọc và phân trang.
   * @param {ExamHistorySummaryQueryDTO} query - Đối tượng chứa các tiêu chí lọc (userId, status, date range) 
   * @returns {Promise<PaginatedResult<ExamHistorySummaryResponseDTO>>} 
   */
  getHistorySummaryList(query: ExamHistorySummaryQueryDTO): Promise<PaginatedResult<ExamHistorySummaryResponseDTO>>;

  /**
   * @description Lấy thông tin chi tiết của một bản ghi lịch sử thi cụ thể.
   * @param {string} id - Định danh duy nhất (UUID) của bản ghi lịch sử thi.
   * @returns {Promise<ExamHistorySummaryResponseDTO>} 
   */
  getHistorySummaryDetail(id: string): Promise<ExamHistorySummaryResponseDTO>;
}