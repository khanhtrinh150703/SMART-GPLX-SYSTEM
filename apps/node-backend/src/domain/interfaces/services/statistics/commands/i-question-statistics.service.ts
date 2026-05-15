import { IQuestionAttemptRequest, IRecordBulkAttemptsRequest } from "@/domain/entities/statistics/question-statistics.props";

/**
 * @interface IQuestionStatisticsService
 * @description Định nghĩa các nghiệp vụ (Commands) làm thay đổi trạng thái thống kê câu hỏi.
 * Tập trung vào việc ghi nhận và xử lý dữ liệu sau khi người dùng tương tác với câu hỏi.
 */
export interface IQuestionStatisticsService {
  /**
   * @description Ghi nhận và cập nhật hàng loạt thống kê cho nhiều câu hỏi cùng một lúc.
   * @param {IRecordBulkAttemptsRequest} attempts - Đối tượng chứa danh sách các lượt trả lời cần ghi nhận.
   * @returns {Promise<void>} Hoàn tất khi dữ liệu đã được lưu trữ xong.
   */
  recordBulkAttempts(
    attempts: IRecordBulkAttemptsRequest,
  ): Promise<void>;

  /**
   * @description Ghi nhận một lượt trả lời đơn lẻ cho một câu hỏi.
   * @param {IQuestionAttemptRequest} data - Đối tượng chứa thông tin lượt thử (questionId, isCorrect, ...).
   * @returns {Promise<void>} Hoàn tất khi dữ liệu đã được lưu trữ xong.
   */
  recordAttempt(data: IQuestionAttemptRequest): Promise<void>;
}