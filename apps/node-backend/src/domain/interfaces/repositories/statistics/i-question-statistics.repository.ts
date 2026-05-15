import { QuestionStatisticsEntity } from "@/domain/entities/statistics/question-statistics.entity";

/**
 * @interface IQuestionStatisticsRepository
 * @description Interface quản lý lưu trữ thống kê độ khó câu hỏi toàn hệ thống.
 */
export interface IQuestionStatisticsRepository {
  /**
   * @description Tìm kiếm thống kê theo ID câu hỏi.
   * @param {string} questionId - ID của câu hỏi cần tìm.
   * @returns {Promise<QuestionStatisticsEntity | null>} Thực thể thống kê hoặc null nếu không thấy.
   */
  findById(questionId: string): Promise<QuestionStatisticsEntity | null>;

  /**
   * @description Lấy danh sách các câu hỏi có tỷ lệ lỗi cao nhất.
   * @param {number} limit - Số lượng bản ghi tối đa.
   * @returns {Promise<QuestionStatisticsEntity[]>} Danh sách các câu hỏi khó nhất.
   */
  findTopDifficultQuestions(limit: number): Promise<QuestionStatisticsEntity[]>;

  /**
   * @description Tìm kiếm hàng loạt thống kê theo danh sách ID câu hỏi (Batch Fetching).
   * @param {string[]} questionIds - Mảng chứa các ID câu hỏi cần truy vấn.
   * @returns {Promise<QuestionStatisticsEntity[]>} Mảng các thực thể thống kê tìm thấy.
   */
  findByIds(questionIds: string[]): Promise<QuestionStatisticsEntity[]>;

  /**
   * @description Tạo mới bản ghi thống kê câu hỏi.
   * @param {QuestionStatisticsEntity} entity - Thực thể cần khởi tạo.
   * @returns {Promise<QuestionStatisticsEntity>} Thực thể đã được lưu vào Database.
   */
  create(entity: QuestionStatisticsEntity): Promise<QuestionStatisticsEntity>;

  /**
   * @description Cập nhật chỉ số thống kê (Loại bỏ các trường bất biến).
   * @param {QuestionStatisticsEntity} entity - Thực thể mang dữ liệu mới.
   * @returns {Promise<QuestionStatisticsEntity>} Thực thể sau khi đã cập nhật thành công.
   */
  update(entity: QuestionStatisticsEntity): Promise<QuestionStatisticsEntity>;

  /**
   * @description Lưu đồng thời nhiều bản ghi thống kê (Batch Update).
   * @param {QuestionStatisticsEntity[]} entities - Danh sách các thực thể thống kê.
   * @returns {Promise<void>}
   */
  saveBulk(entities: QuestionStatisticsEntity[]): Promise<void>;
}
