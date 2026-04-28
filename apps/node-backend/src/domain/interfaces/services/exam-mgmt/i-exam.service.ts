import { ExamQueryDTO } from "@/application/dtos/request/exam/exam-query.request.dto";
import { UpdateExamDTO } from "@/application/dtos/request/exam/update-exam.request.dto";
import { IExamResponse } from "@/application/dtos/response/exam/exam-response.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @description Interface điều phối các nghiệp vụ liên quan đến Exam.
 */
export interface IExamService {

  /**
   * @description Lấy thông tin chi tiết một bài thi theo ID.
   * @param id - Mã định danh bài thi.
   * @returns {Promise<ExamEntity>}
   * @throws {AppError} Nếu không tìm thấy bài thi hoặc ID trống.
   */
  getExamById(id: string): Promise<ExamEntity>;

  /**
   * @description Lấy danh sách đề thi có phân trang, hỗ trợ lọc theo trạng thái, người dùng và hạng bằng lái.
   * @param {ExamQueryDTO} query - Tham số truy vấn bao gồm phân trang và bộ lọc đặc thù của Exam.
   * @returns {Promise<PaginatedResult<IExamResponse>>} Kết quả phân trang chứa danh sách dữ liệu đề thi.
   */
  getPaginatedExams(query: ExamQueryDTO): Promise<PaginatedResult<IExamResponse>>;


  /**
   * @description Cập nhật thông tin chi tiết của một đề thi hiện có.
   * @param {string} id - ID của đề thi cần cập nhật.
   * @param {UpdateExamDTO} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<IExamResponse>} DTO phản hồi sau khi cập nhật thành công.
   */
  updateExam(id: string, dto: UpdateExamDTO): Promise<IExamResponse>;

  /**
   * @description Xóa mềm đề thi sau khi đã kiểm tra logic nghiệp vụ tại Entity.
   * @param id - ID của đề thi cần xóa.
   * @returns {Promise<void>} Trả về void vì thường xóa xong chỉ cần báo thành công.
   */
  deleteExam(id: string): Promise<void>;

  /**
   * @description Khôi phục đề thi đã xóa và trả về dữ liệu mới nhất để cập nhật UI.
   * @param id - ID của đề thi cần khôi phục.
   * @returns {Promise<ExamResponseDTO>} DTO của đề thi sau khi hồi sinh.
   */
  restoreExam(id: string): Promise<IExamResponse>;
}