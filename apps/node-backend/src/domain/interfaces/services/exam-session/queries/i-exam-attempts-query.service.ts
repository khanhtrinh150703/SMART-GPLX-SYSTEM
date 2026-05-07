import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";

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
   * @description Truy xuất danh sách lịch sử thi của một người dùng.
   * @param {string} userId - ID định danh thí sinh.
   * @returns {Promise<IExamAttemptResponseDTO[]>} Mảng danh sách các lượt thi đã thực hiện.
   */
  getUserAttemptHistory(userId: string): Promise<IExamAttemptResponseDTO[]>;
}