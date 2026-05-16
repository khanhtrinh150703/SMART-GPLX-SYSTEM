import { ExamHistoryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-query.request.dto";
import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";

/**
 * @description Giao diện định nghĩa các phương thức thao tác dữ liệu (Persistence) cho Lượt thi.
 */
export interface IExamAttemptRepository {
  /**
   * @description Lưu một lượt thi mới vào cơ sở dữ liệu.
   * @param {ExamAttemptEntity} attempt - Thực thể lượt thi cần lưu.
   * @returns {Promise<ExamAttemptEntity>} Thực thể sau khi đã lưu thành công.
   */
  createExamAttempt(attempt: ExamAttemptEntity): Promise<ExamAttemptEntity>;

  /**
   * @description Cập nhật thông tin của một lượt thi đã tồn tại.
   * @param {ExamAttemptEntity} attempt - Thực thể lượt thi với dữ liệu mới.
   * @returns {Promise<ExamAttemptEntity | null>} Thực thể sau cập nhật hoặc null nếu không tìm thấy.
   */
  updateExamAttempt(
    attempt: ExamAttemptEntity,
  ): Promise<ExamAttemptEntity | null>;

  /**
   * @description Truy vấn thông tin một lượt thi cụ thể qua mã định danh.
   * @param {string} id - ID của lượt thi.
   * @returns {Promise<ExamAttemptEntity | null>} Thực thể tìm thấy hoặc null.
   */
  findById(id: string): Promise<ExamAttemptEntity | null>;

  /**
   * @description Lấy danh sách toàn bộ lịch sử thi của một người dùng cụ thể.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<ExamAttemptEntity[]>} Mảng các thực thể lượt thi.
   */
  findByUserId(userId: string): Promise<ExamAttemptEntity[]>;

  /**
   * @description Tìm kiếm và đếm tổng số lượng lịch sử làm bài có phân trang.
   * English: Find and count exam history records with pagination.
   * @param {ExamHistoryQueryDTO} filter - Bộ lọc tìm kiếm (Chứa keyword search).
   * @param {number} skip - Số bản ghi bỏ qua (Offset).
   * @param {number} take - Số bản ghi tối đa lấy ra (Limit).
   * @returns {Promise<[ExamAttemptEntity[], number]>} - Mảng kết quả và tổng số bản ghi.
   */
  findAndCount(
    filter: ExamHistoryQueryDTO,
    skip: number,
    take: number,
  ): Promise<[ExamAttemptEntity[], number]>;

  /**
   * @description Xóa mềm: Đánh dấu 'deletedAt' để ẩn khỏi người dùng nhưng vẫn giữ lại dữ liệu trong DB.
   * @param {string} id - ID của lượt thi cần xóa.
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Xóa cứng: Loại bỏ vĩnh viễn bản ghi khỏi cơ sở dữ liệu.
   * @param {string} id - ID của lượt thi cần xóa.
   */
  hardDelete(id: string): Promise<void>;
}
