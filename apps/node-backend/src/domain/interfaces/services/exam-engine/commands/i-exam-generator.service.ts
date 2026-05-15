import { GenerateExamDTO } from "@/application/dtos/request/exam/generate-exam.request.dto";
import { IExamResponseDTO } from "@/application/dtos/response/exam/exam.response.dto";

/**
 * @description Interface chuyên biệt cho việc khởi tạo và bốc đề thi (Exam Generator).
 */
export interface IExamGeneratorService {
  
  /**
   * @description Thực hiện thuật toán bốc đề 3 lớp, tạo phiên thi (Session) và lưu Snapshot cấu trúc đề vào MySQL.
   * @param {GenerateExamDTO} dto - Đối tượng chứa thông tin matrixId, userId và name đề thi.
   * @returns {Promise<IExamResponseDTO>} Trả về thông tin cơ bản của bài thi vừa khởi tạo để bắt đầu làm bài.
   * @throws {AppError} Ném lỗi nếu Matrix không tồn tại hoặc kho câu hỏi không đủ số lượng.
   */
  generate(dto: GenerateExamDTO): Promise<IExamResponseDTO>;
}