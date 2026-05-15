import { QuestionStatisticsResponseDTO } from "@/application/dtos/response/statistics/question-statistics.response.dto";

/**
 * @interface IQuestionStatisticsQuery
 * @description Định nghĩa các phương thức truy vấn dữ liệu thống kê câu hỏi (Read-only).
 * Đảm bảo tính phân tách trách nhiệm, không làm thay đổi trạng thái dữ liệu.
 */
export interface IQuestionStatisticsQuery {
  /**
   * @description Lấy danh sách các câu hỏi có độ khó cao nhất dựa trên tỷ lệ trả lời sai (errorRate).
   * @param {number} limit - Số lượng bản ghi tối đa cần lấy từ hệ thống.
   * @returns {Promise<QuestionStatisticsResponseDTO[]>} Một danh sách các DTO chứa thông tin thống kê câu hỏi.
   */
  getTopDifficultQuestions(
    limit: number,
  ): Promise<QuestionStatisticsResponseDTO[]>;

  /**
   * @description Lấy thông tin thống kê chi tiết của một câu hỏi cụ thể theo định danh.
   * @param {string} questionId - ID định danh duy nhất của câu hỏi.
   * @returns {Promise<QuestionStatisticsResponseDTO | null>} DTO thống kê hoặc null nếu chưa có dữ liệu.
   */
  getById(questionId: string): Promise<QuestionStatisticsResponseDTO | null>;
}