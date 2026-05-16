import { ExamHistorySummaryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-summary-query.request.dto";
import { ExamHistorySummaryEntity } from "@/domain/entities/exam-history/exam-history-summary.entity";

/**
 * @interface IExamHistorySummaryRepository
 * @description Giao diện quản lý lưu trữ cho thực thể Lịch sử thi (Exam History).
 */
export interface IExamHistorySummaryRepository {
  /**
   * @description Lưu một bản ghi lịch sử thi mới vào Database.
   * @param {ExamHistorySummaryEntity} entity - Thực thể lịch sử thi chứa thông tin kết quả bài làm.
   * @returns {Promise<ExamHistorySummaryEntity>} Thực thể đã được lưu trữ thành công.
   */
  create(entity: ExamHistorySummaryEntity): Promise<ExamHistorySummaryEntity>;

  /**
   * @description Cập nhật bản ghi lịch sử thi (Dùng cho Soft Delete hoặc update Metadata).
   * @param {ExamHistorySummaryEntity} entity - Thực thể mang dữ liệu mới.
   * @returns {Promise<ExamHistorySummaryEntity>} Thực thể đã được lưu trữ thành công.
   */
  update(entity: ExamHistorySummaryEntity): Promise<ExamHistorySummaryEntity>;

  /**
   * @description Xóa mềm: Cập nhật trường deletedAt để ẩn bản ghi nhưng vẫn giữ lại trong DB.
   * @param {string} id - ID của bản ghi.
   */
  softDelete(id: string): Promise<void>;

  /**
   * @description Xóa cứng: Xóa vĩnh viễn bản ghi khỏi Database.
   * @param {string} id - ID của bản ghi.
   */
  hardDelete(id: string): Promise<void>;

  /**
   * @description Tìm kiếm một bản ghi lịch sử dựa trên ID.
   * @param {string} id - Định danh duy nhất của bản ghi lịch sử.
   * @returns {Promise<ExamHistorySummaryEntity | null>} Thực thể tìm thấy hoặc null nếu không tồn tại.
   */
  findById(id: string): Promise<ExamHistorySummaryEntity | null>;

  /**
   * @description Tìm kiếm một bản ghi lịch sử dựa trên ID.
   * @param {string} id - Định danh duy nhất của bản ghi lịch sử.
   * @returns {Promise<ExamHistorySummaryEntity | null>} Thực thể tìm thấy hoặc null nếu không tồn tại.
   */
  findByIdSystem(id: string): Promise<ExamHistorySummaryEntity | null>;

  /**
   * @description Tìm kiếm và đếm tổng số lượng lịch sử thi có phân trang.
   * @param {ExamHistorySummaryQueryDTO} filter - Đối tượng chứa các tiêu chí lọc (userId, isPassed, ...).
   * @param {number} skip - Số bản ghi bỏ qua (Offset).
   * @param {number} take - Số bản ghi lấy ra (Limit).
   * @returns {Promise<[ExamHistorySummaryEntity[], number]>} Tuple chứa danh sách thực thể và tổng số lượng.
   */
  findAndCount(
    filter: ExamHistorySummaryQueryDTO,
    skip: number,
    take: number,
  ): Promise<[ExamHistorySummaryEntity[], number]>;
}
