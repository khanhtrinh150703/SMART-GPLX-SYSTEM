import { CreateQuestionRequestDTO } from "@/application/dtos/request/question/create-question.request.dto";
import { UpdateQuestionRequestDTO } from "@/application/dtos/request/question/update-question.request.dto";
import { IQuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { QuestionImportEntity } from "@/domain/entities/import/import-question.entity";

/**
 * @interface IQuestionService
 * @description Giao diện định nghĩa các nghiệp vụ xử lý câu hỏi lái xe.
 * Tầng Application Service điều phối luồng dữ liệu giữa Controller và Repository.
 */
export interface IQuestionService {
  /**
   * @description Tiếp nhận DTO, thực hiện quy trình tạo mới câu hỏi và lưu trữ.
   * @param {CreateQuestionRequestDTO} dto - Dữ liệu yêu cầu từ Client.
   * @returns {Promise<IQuestionResponseDTO>} DTO phản hồi chứa thông tin câu hỏi vừa tạo.
   */
  createQuestion(dto: CreateQuestionRequestDTO): Promise<IQuestionResponseDTO>;

  /**
   * @description Cập nhật thông tin chi tiết của một câu hỏi hiện có.
   * @param {string} id - ID của câu hỏi cần cập nhật.
   * @param {UpdateQuestionRequestDTO} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<IQuestionResponseDTO>} DTO phản hồi sau khi cập nhật thành công.
   */
  updateQuestion(id: string, dto: UpdateQuestionRequestDTO): Promise<IQuestionResponseDTO>;

  /**
   * @description Xóa mềm câu hỏi sau khi đã kiểm tra logic nghiệp vụ tại Entity.
   * @param id - ID của câu hỏi cần xóa.
   * @returns {Promise<IDeleteResponseDTO>} Trả về void vì thường xóa xong chỉ cần báo thành công.
   */
  deleteQuestion(id: string): Promise<IDeleteResponseDTO>;

  /**
   * @description Khôi phục câu hỏi đã xóa và trả về dữ liệu mới nhất để cập nhật UI.
   * @param id - ID của câu hỏi cần khôi phục.
   * @returns {Promise<IQuestionResponseDTO>} DTO của câu hỏi sau khi hồi sinh.
   */
  restoreQuestion(id: string): Promise<IQuestionResponseDTO>;

  /**
   * @description Thực hiện tạo câu hỏi hàng loạt từ dữ liệu nhập (Import).
   * @param {QuestionImportEntity} importEntity - Đối tượng chứa dữ liệu câu hỏi đã qua xử lý.
   * @returns {Promise<void>}
   */
  createFromImport(importEntity: QuestionImportEntity): Promise<void>

  /**
   * @description Kiểm tra tính toàn vẹn và sự hiện diện của một danh sách câu hỏi trong hệ thống.
   * @param {string[]} ids - Mảng danh sách các ID câu hỏi cần xác thực.
   * @returns {Promise<void>} Trả về Promise rỗng nếu tất cả ID đều hợp lệ.
   * @throws {AppError} Ném lỗi QUESTION_DATA_INVALID nếu số lượng tìm thấy không khớp với số lượng ID truyền vào.
   */
  validateExistence(ids: string[]): Promise<void>;
}