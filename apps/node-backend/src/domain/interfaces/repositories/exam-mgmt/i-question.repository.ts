import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { GetSelectionPoolDto } from "@/application/dtos/request/question/selection-question.request.dto";
import { Question } from "@/domain/entities/question/question.entity";
import { QuestionWithDetails } from "@/infrastructure/persistence/exam-mgmt";
import { QuestionRelatedCount } from "@/shared/types/count.types";

/**
 * @interface IQuestionRepository
 * @description Giao diện quản lý lưu trữ (Repository Pattern) cho thực thể Câu hỏi.
 * Định nghĩa các phương thức để tương tác với Database ở tầng Infrastructure.
 */
export interface IQuestionRepository {
  /**
   * @description Lưu câu hỏi mới, kèm theo đáp án và liên kết hạng bằng lái vào Database
   * @param {Question} entity - Thực thể câu hỏi chứa đầy đủ thông tin nghiệp vụ
   * @returns {Promise<Question>} Thực thể câu hỏi sau khi đã được bền vững hóa
   */
  createQuestion(entity: Question): Promise<Question>;

  /**
   * @description Cập nhật toàn diện thông tin câu hỏi, bao gồm cả việc làm mới đáp án và hạng bằng lái
   * @param {Question} entity - Thực thể chứa dữ liệu mới để đồng bộ vào DB
   * @returns {Promise<Question>} Thực thể câu hỏi sau khi đã cập nhật thành công
   */
  updateQuestion(entity: Question): Promise<Question>;

  /**
   * @description Lấy danh sách câu hỏi thuộc về một chương cụ thể (Chapter)
   * @param {string} chapterId - ID của chương cần lấy câu hỏi
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi (Eager loading answers & licenses)
   */
  findByChapterId(chapterId: string): Promise<Question[]>;

  /**
   * @description Lấy chi tiết một câu hỏi bằng ID, bao gồm cả các quan hệ liên quan
   * @param {string} id - ID của câu hỏi cần tìm
   * @returns {Promise<Question | null>} Thực thể câu hỏi hoặc null nếu không tồn tại
   */
  findById(id: string): Promise<Question | null>;

  /**
   * @description Lấy chi tiết một câu hỏi bằng ID, bao gồm cả các quan hệ liên qua
   * @param {string} id - ID của câu hỏi cần tìm
   * @returns {Promise<Question | null>} Thực thể câu hỏi hoặc null nếu không tồn tại
   */
  findByIdSystem(id: string): Promise<Question | null>;

  /**
   * @description Lấy danh sách các câu hỏi dựa trên danh sách mã định danh (IDs).
   * @param {string[]} questionIds - Danh sách các ID của câu hỏi cần truy vấn.
   * @returns {Promise<Question[]>} Danh sách các thực thể câu hỏi.
   */
  findByIds(questionIds: string[]): Promise<Question[]>;

  /**
   * @description Xóa vĩnh viễn câu hỏi khỏi cơ sở dữ liệu (Hard Delete).
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<void>}
   */
  hardDelete(id: string): Promise<void>;

  /**
   * @description Đánh dấu xóa câu hỏi (Soft Delete) bằng cách cập nhật trường deletedAt.
   * @param {string} id - ID của câu hỏi.
   * @returns {Promise<void>}
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Thực hiện khôi phục bằng cách gán deletedAt = null
   * @param id ID của câu hỏi cần khôi phục
   */
  restore(id: string): Promise<Question>;

  /**
   * @description Truy vấn danh sách câu hỏi và tổng số lượng bản ghi phục vụ cho giao diện quản trị (Admin). 
   * @param {QuestionsAdminQueryDto} dto - Đối tượng chứa các tiêu chí lọc (Search, Chapter, License, Difficulty, Status) 
   * @param {number} skip - Số bản ghi bỏ qua.
   * @param {number} take - Số bản ghi lấy ra.
   * @returns {Promise<[Question[], number]>} Một Tuple bao gồm:
   */
  findAndCountAdmin(
    dto: QuestionsAdminQueryDto,
    skip: number,
    take: number
  ): Promise<[Question[], number]>

  /**
   * @description Lấy toàn bộ câu hỏi khả dụng cho hạng bằng lái.
   * @param licenseId - ID của hạng bằng (B1, B2, C...).
   */
  findByLicenseCategory(licenseId: string[]): Promise<Question[]>;

  /**
   * @description Đếm số lượng câu hỏi đang hoạt động (không bị xóa mềm) dựa trên danh sách ID.
   * @param {string[]} ids - Mảng danh sách các UUID của câu hỏi.
   * @returns {Promise<number>} Tổng số bản ghi tìm thấy trong Database.
   */
  countActiveByIds(ids: string[]): Promise<number>;

  /**
   * @description Truy xuất kho câu hỏi (Selection Pool) dựa trên bộ lọc để phục vụ tạo đề/ma trận.
   * @param {GetSelectionPoolDto} filter - Đối tượng chứa các tiêu chí lọc câu hỏi.
   * @returns {Promise<QuestionWithDetails[]>} Danh sách tóm tắt các câu hỏi thỏa điều kiện.
   */
  findSelectionPool(filter: GetSelectionPoolDto): Promise<QuestionWithDetails[]>;

  /**
   * @description Kiểm tra sự tồn tại của một danh sách ID câu hỏi.
   * @param {string[]} ids - Mảng các ID cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu tất cả IDs đều tồn tại.
   */
  existsAll(ids: string[]): Promise<boolean>;

  /**
   * @description Thống kê tần suất xuất hiện và các ràng buộc của câu hỏi trong toàn bộ hệ thống.
   * @param {string} id - Định danh duy nhất (UUID) của câu hỏi. (Unique identifier of the question).
   * @returns {Promise<QuestionRelatedCount>} Đối tượng chứa số lượng chi tiết các quan hệ (ví dụ: ExamDetails, MatrixDetails, UserWeaknesses). (Object containing counts of related entities).
   */
  countRelatedData(id: string): Promise<QuestionRelatedCount>;
}