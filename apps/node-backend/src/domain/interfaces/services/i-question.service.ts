import { CreateQuestionDto } from "@/application/dtos/request/question/create-question.request.dto";
import { UpdateQuestionDto } from "@/application/dtos/request/question/update-question.request.dto";
import { QuestionResponseDto } from "@/application/dtos/response/question/question.respone.dto";

/**
 * @interface IQuestionService
 * @description Giao diện định nghĩa các nghiệp vụ xử lý câu hỏi lái xe.
 * Tầng Application Service điều phối luồng dữ liệu giữa Controller và Repository.
 */
export interface IQuestionService {
  /**
   * @description Tiếp nhận DTO, thực hiện quy trình tạo mới câu hỏi và lưu trữ.
   * @param {CreateQuestionDto} dto - Dữ liệu yêu cầu từ Client.
   * @returns {Promise<QuestionResponseDto>} DTO phản hồi chứa thông tin câu hỏi vừa tạo.
   */
  createQuestion(dto: CreateQuestionDto): Promise<QuestionResponseDto>;

  /**
   * @description Cập nhật thông tin chi tiết của một câu hỏi hiện có.
   * @param {string} id - ID của câu hỏi cần cập nhật.
   * @param {UpdateQuestionDto} dto - Dữ liệu cập nhật mới.
   * @returns {Promise<QuestionResponseDto>} DTO phản hồi sau khi cập nhật thành công.
   */
  updateQuestion(id: string, dto: UpdateQuestionDto): Promise<QuestionResponseDto>;

  /**
   * @description Tìm kiếm tất cả câu hỏi thuộc về một chương (Chapter) cụ thể.
   * @param {string} chapterId - ID của chương lý thuyết.
   * @returns {Promise<QuestionResponseDto[]>} Danh sách DTO các câu hỏi tìm được.
   */
  getQuestionsByChapter(chapterId: string): Promise<QuestionResponseDto[]>;

  /**
   * @description Lấy thông tin chi tiết một câu hỏi để hiển thị hoặc chỉnh sửa.
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<QuestionResponseDto | null>} DTO chi tiết hoặc null nếu không tồn tại.
   */
  getQuestionById(id: string): Promise<QuestionResponseDto | null>;

  /**
   * @description Xóa mềm câu hỏi sau khi đã kiểm tra logic nghiệp vụ tại Entity.
   * @param id - ID của câu hỏi cần xóa.
   * @returns {Promise<void>} Trả về void vì thường xóa xong chỉ cần báo thành công.
   */
  deleteQuestion(id: string): Promise<void>;

  /**
   * @description Khôi phục câu hỏi đã xóa và trả về dữ liệu mới nhất để cập nhật UI.
   * @param id - ID của câu hỏi cần khôi phục.
   * @returns {Promise<QuestionResponseDto>} DTO của câu hỏi sau khi hồi sinh.
   */
  restoreQuestion(id: string): Promise<QuestionResponseDto>;
}