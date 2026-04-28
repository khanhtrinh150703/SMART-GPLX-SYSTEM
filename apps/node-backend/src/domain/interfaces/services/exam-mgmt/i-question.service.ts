import { CreateQuestionRequestDto } from "@/application/dtos/request/question/create-question.request.dto";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { UpdateQuestionRequestDto } from "@/application/dtos/request/question/update-question.request.dto";
import { QuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { QuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { QuestionImportEntity } from "@/domain/entities/import/import-question.entity";
import { Question } from "@/domain/entities/question/question.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @interface IQuestionService
 * @description Giao diện định nghĩa các nghiệp vụ xử lý câu hỏi lái xe.
 * Tầng Application Service điều phối luồng dữ liệu giữa Controller và Repository.
 */
export interface IQuestionService {
  /**
   * @description Tiếp nhận DTO, thực hiện quy trình tạo mới câu hỏi và lưu trữ.
   * @param {CreateQuestionRequestDto} dto - Dữ liệu yêu cầu từ Client.
   * @returns {Promise<QuestionResponseDTO>} DTO phản hồi chứa thông tin câu hỏi vừa tạo.
   */
  createQuestion(dto: CreateQuestionRequestDto): Promise<QuestionResponseDTO>;

  /**
   * @description Cập nhật thông tin chi tiết của một câu hỏi hiện có.
   * @param {string} id - ID của câu hỏi cần cập nhật.
   * @param {UpdateQuestionRequestDto} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<QuestionResponseDTO>} DTO phản hồi sau khi cập nhật thành công.
   */
  updateQuestion(id: string, dto: UpdateQuestionRequestDto): Promise<QuestionResponseDTO>;

  /**
   * @description Tìm kiếm tất cả câu hỏi thuộc về một chương (Chapter) cụ thể.
   * @param {string} chapterId - ID của chương lý thuyết.
   * @returns {Promise<QuestionResponseDto[]>} Danh sách DTO các câu hỏi tìm được.
   */
  getQuestionsByChapter(chapterId: string): Promise<QuestionResponseDTO[]>;

  /**
   * @description Lấy thông tin chi tiết một câu hỏi để hiển thị hoặc chỉnh sửa.
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<QuestionResponseDTO | null>} DTO chi tiết hoặc null nếu không tồn tại.
   */
  getQuestionById(id: string): Promise<QuestionResponseDTO | null>;

  /**
   * @description Xóa mềm câu hỏi sau khi đã kiểm tra logic nghiệp vụ tại Entity.
   * @param id - ID của câu hỏi cần xóa.
   * @returns {Promise<void>} Trả về void vì thường xóa xong chỉ cần báo thành công.
   */
  deleteQuestion(id: string): Promise<void>;

  /**
   * @description Khôi phục câu hỏi đã xóa và trả về dữ liệu mới nhất để cập nhật UI.
   * @param id - ID của câu hỏi cần khôi phục.
   * @returns {Promise<QuestionResponseDTO>} DTO của câu hỏi sau khi hồi sinh.
   */
  restoreQuestion(id: string): Promise<QuestionResponseDTO>;

  /**
   * @description Lấy danh sách câu hỏi lý thuyết có phân trang, hỗ trợ bộ lọc kết hợp và tìm kiếm.
   * @param {QuestionsAdminQueryDto} query - Tham số truy vấn bao gồm phân trang (page, limit) và các bộ lọc.
   * @returns {Promise<PaginatedResult<QuestionAdminResponseDTO>>} Kết quả phân trang chứa danh sách Question.
   */
  getPaginatedQuestions(query: QuestionsAdminQueryDto): Promise<PaginatedResult<QuestionAdminResponseDTO>>

  /**
   * @description Thực hiện tạo câu hỏi hàng loạt từ dữ liệu nhập (Import).
   * @param {QuestionImportEntity} importEntity - Đối tượng chứa dữ liệu câu hỏi đã qua xử lý.
   * @returns {Promise<void>}
   */
  createFromImport(importEntity: QuestionImportEntity): Promise<void>

  /**
   * @description Lấy danh sách các câu hỏi dựa trên danh sách mã định danh (IDs).
   * @param {string[]} questionIds - Danh sách các ID của câu hỏi cần truy vấn.
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi.
   */
  getQuestionsByIds(questionIds: string[]): Promise<Question[]>;

  /**
   * @description Lấy toàn bộ câu hỏi khả dụng cho hạng bằng lái.
   * @param licenseId - ID của hạng bằng (B1, B2, C...).
   */
  getByLicenseCategory(licenseId: string[]): Promise<Question[]>;

  /**
   * @description Kiểm tra tính toàn vẹn và sự hiện diện của một danh sách câu hỏi trong hệ thống.
   * @param {string[]} ids - Mảng danh sách các ID câu hỏi cần xác thực.
   * @returns {Promise<void>} Trả về Promise rỗng nếu tất cả ID đều hợp lệ.
   * @throws {AppError} Ném lỗi QUESTION_DATA_INVALID nếu số lượng tìm thấy không khớp với số lượng ID truyền vào.
   */
  validateExistence(ids: string[]): Promise<void>;
}