import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { Question } from "@/domain/entities/question/question.entity";

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
  create(entity: Question): Promise<Question>;

  /**
   * @description Cập nhật toàn diện thông tin câu hỏi, bao gồm cả việc làm mới đáp án và hạng bằng lái
   * @param {string} id - ID duy nhất của câu hỏi cần cập nhật
   * @param {Question} entity - Thực thể chứa dữ liệu mới để đồng bộ vào DB
   * @returns {Promise<Question>} Thực thể câu hỏi sau khi đã cập nhật thành công
   */
  update(id: string, entity: Question): Promise<Question>;

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
   * @description Thực hiện Soft Delete bằng cách gán deletedAt = now()
   * @param id ID của câu hỏi cần xóa
   * @returns Entity sau khi đã cập nhật để Service có thể dùng tiếp nếu cần
   */
  delete(id: string): Promise<void>;

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
}