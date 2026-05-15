import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { GetSelectionPoolDto } from "@/application/dtos/request/question/selection-question.request.dto";
import { IQuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { IExamQuestionSummaryResponseDTO } from "@/application/dtos/response/question/exam-question-summary.respone.dto";
import { IQuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { Question } from "@/domain/entities/question/question.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @description Interface định nghĩa các truy vấn đọc dữ liệu (Read-side) cho Module Question.
 * Trả về trực tiếp DTO để tối ưu hiệu suất, không thông qua Entity.
 */
export interface IQuestionQueryService {
  /**
   * @description Lấy danh sách các câu hỏi dựa trên danh sách mã định danh (IDs).
   * @param {string[]} questionIds - Danh sách các ID của câu hỏi cần truy vấn.
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi.
   */
  getQuestionsByIds(questionIds: string[]): Promise<Question[]>;

  /**
   * @description Lấy toàn bộ câu hỏi khả dụng theo danh sách mã hạng bằng lái.
   * @param {string[]} licenseId - Danh sách mã định danh của các hạng bằng lái (B1, B2, C...).
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi tìm thấy phù hợp với hạng bằng.
   */
  getByLicenseCategoryIds(licenseId: string[]): Promise<Question[]>;

  /**
   * @description Lấy toàn bộ danh sách câu hỏi dựa trên danh sách mã chương học được chỉ định.
   * @param {string[]} chapterIds - Danh sách mã định danh của các chương học cần truy vấn câu hỏi.
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi thuộc về các chương học đó.
   */
  getByChapterIds(chapterIds: string[]): Promise<Question[]>;

  /**
   * @description Lấy danh sách câu hỏi lý thuyết có phân trang, hỗ trợ bộ lọc kết hợp và tìm kiếm.
   * @param {QuestionsAdminQueryDto} query - Tham số truy vấn bao gồm phân trang (page, limit) và các bộ lọc.
   * @returns {Promise<PaginatedResult<IQuestionAdminResponseDTO>>} Kết quả phân trang chứa danh sách Question.
   */
  getPaginatedQuestions(
    query: QuestionsAdminQueryDto,
  ): Promise<PaginatedResult<IQuestionAdminResponseDTO>>;

  /**
   * @description Tìm kiếm tất cả câu hỏi thuộc về một chương (Chapter) cụ thể.
   * @param {string} chapterId - ID của chương lý thuyết.
   * @returns {Promise<IQuestionResponseDTO[]>} Danh sách DTO các câu hỏi tìm được.
   */
  getQuestionsByChapter(chapterId: string): Promise<IQuestionResponseDTO[]>;

  /**
   * @description Lấy thông tin chi tiết một câu hỏi để hiển thị hoặc chỉnh sửa.
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<IQuestionResponseDTO | null>} DTO chi tiết hoặc null nếu không tồn tại.
   */
  getQuestionById(id: string): Promise<IQuestionResponseDTO | null>;

  /**
   * @description Truy xuất danh sách câu hỏi dưới dạng tóm tắt (Summary) dựa trên hạng bằng lái.
   * Dữ liệu được tối ưu hóa (Lightweight) để phục vụ việc hiển thị danh sách hoặc lập ma trận đề thi.
   * @param {GetSelectionPoolDto} query
   * @returns {Promise<IExamQuestionSummaryResponseDTO[]>} Mảng các DTO tóm tắt, không bao gồm dữ liệu media và chi tiết đáp án.
   */
  getQuestionsSummary(
    query: GetSelectionPoolDto,
  ): Promise<IExamQuestionSummaryResponseDTO[]>;
}
