import { CreateManualExamRequestDTO } from "@/application/dtos/request/exam/create-exam-manual.request.dto";
import { UpdateExamRequestDTO } from "@/application/dtos/request/exam/update-exam.request.dto";
import { IExamResponseDTO } from "@/application/dtos/response/exam/exam.response.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";

/**
 * @description Interface điều phối các nghiệp vụ liên quan đến Exam.
 */
export interface IExamService {

  /**
   * @description Lưu thông tin bài thi mới vào cơ sở dữ liệu.
   * @param {CreateManualExamRequestDTO} dto - Đối tượng chứa thông tin matrixId, userId và name đề thi.
   * @param exam - Đối tượng thực thể bài thi (ExamEntity) cần lưu.
   * @returns {Promise<IExamResponseDTO>}
   */
  createManual(exam: CreateManualExamRequestDTO): Promise<IExamResponseDTO>;
  
  /**
   * @description Cập nhật thông tin chi tiết của một đề thi hiện có.
   * @param {string} id - ID của đề thi cần cập nhật.
   * @param {UpdateExamDTUpdateExamRequestDTOO} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<IExamResponseDTO>} DTO phản hồi sau khi cập nhật thành công.
   */
  updateExam(id: string, dto: UpdateExamRequestDTO): Promise<IExamResponseDTO>;

  /**
   * @description Xóa mềm đề thi sau khi đã kiểm tra logic nghiệp vụ tại Entity.
   * @param id - ID của đề thi cần xóa.
   * @returns {Promise<IDeleteResponseDTO>} Trả về void vì thường xóa xong chỉ cần báo thành công.
   */
  deleteExam(id: string): Promise<IDeleteResponseDTO>;

  /**
   * @description Khôi phục đề thi đã xóa và trả về dữ liệu mới nhất để cập nhật UI.
   * @param id - ID của đề thi cần khôi phục.
   * @returns {Promise<IExamResponseDTO>} DTO của đề thi sau khi hồi sinh.
   */
  restoreExam(id: string): Promise<IExamResponseDTO>;
}