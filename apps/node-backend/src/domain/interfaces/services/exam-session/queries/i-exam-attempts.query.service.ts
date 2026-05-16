import { IExamHistoryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-query.request.dto";
import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @interface IExamAttemptQueryService
 * @description Dịch vụ truy vấn (Read-side) dữ liệu lượt thi.
 * Snapshot tại đây là dữ liệu bất biến (Immutable), đảm bảo lịch sử không đổi khi ngân hàng câu hỏi cập nhật.
 */
export interface IExamAttemptQueryService {
  /**
   * @description Lấy chi tiết kết quả kèm Snapshot câu hỏi để phục vụ tính năng "Review bài thi".
   * @param {string} id - ID duy nhất của lượt thi (Attempt ID).
   * @returns {Promise<IExamAttemptResponseDTO>} DTO chứa trạng thái bài thi và snapshot câu hỏi.
   */
  getAttemptDetail(id: string): Promise<IExamAttemptResponseDTO>;

  /**
   * @description Truy xuất danh sách lịch sử các lượt thi có phân trang, hỗ trợ lọc theo các tiêu chí và ánh xạ dữ liệu DTO sạch.
   * @param {IExamHistoryQueryDTO} query - DTO chứa các tham số truy vấn bao gồm tiêu chí lọc và thông số phân trang.
   * @returns {Promise<PaginatedResult<IExamAttemptResponseDTO>>} Kết quả phân trang chứa danh sách các lượt thi đã thực hiện.
   */
  getPaginatedAttempt(
    query: IExamHistoryQueryDTO,
  ): Promise<PaginatedResult<IExamAttemptResponseDTO>>;
}
