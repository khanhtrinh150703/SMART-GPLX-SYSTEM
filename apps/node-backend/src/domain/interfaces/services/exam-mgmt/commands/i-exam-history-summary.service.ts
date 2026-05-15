import { ICreateExamHistorySummaryInputDTO } from "@/application/dtos/request/exam-history/create-exam-history-summary.request.dto";
import { ExamHistorySummaryResponseDTO } from "@/application/dtos/response/exam-history/exam-history-summary.response.dto";

/**
 * @interface IExamHistorySummaryService
 * @description Định nghĩa các nghiệp vụ cốt lõi làm thay đổi trạng thái của lịch sử thi (Command Operations).
 * Đảm bảo tính toàn vẹn dữ liệu khi ghi mới hoặc thực hiện xóa mềm.
 */
export interface IExamHistorySummaryService {
  /**
   * @description Ghi nhận và lưu trữ kết quả bài thi mới vào hệ thống.
   * @param {ICreateExamHistorySummaryInputDTO} dto - Dữ liệu thô từ Controller đã qua lớp validation ban đầu.
   * @returns {Promise<ExamHistorySummaryResponseDTO>} Trả về DTO chứa thông tin kết quả bài thi sau khi lưu.
   */
  createHistory(
    dto: ICreateExamHistorySummaryInputDTO,
  ): Promise<ExamHistorySummaryResponseDTO>;

  /**
   * @description Thực hiện xóa mềm một bản ghi lịch sử thi dựa trên ID.
   * @param {string} id - Định danh duy nhất (UUID) của bản ghi lịch sử cần xóa.
   * @returns {Promise<void>} Kết thúc tác vụ không trả về giá trị.
   */
  softDeleteHistory(id: string): Promise<void>;
}
