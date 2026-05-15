import { UserTopicStatisticsEntity } from "@/domain/entities/statistics/user-topic-statistics.entity";

/**
 * @interface IUserTopicStatisticsRepository
 * @description Interface định nghĩa các hành động lưu trữ cho Aggregate Root Thống kê chủ đề.
 */
export interface IUserTopicStatisticsRepository {
  /**
   * @description Tìm kiếm thống kê theo ID duy nhất.
   * @param {string} id - ID của bản ghi thống kê (UUID).
   * @returns {Promise<UserTopicStatisticsEntity | null>}
   */
  findById(id: string): Promise<UserTopicStatisticsEntity | null>;

  /**
   * @description Tìm kiếm bản ghi thống kê dựa trên cặp User và Topic.
   * @param {string} userId - ID người dùng.
   * @param {string} topicId - ID chủ đề.
   */
  findByUserAndTopic(
    userId: string,
    topicId: string,
  ): Promise<UserTopicStatisticsEntity | null>;

  /**
   * @description Lấy toàn bộ danh sách thống kê các chủ đề của một người dùng.
   * @param {string} userId - ID người dùng.
   */
  findAllByUserId(userId: string): Promise<UserTopicStatisticsEntity[]>;

  /**
   * @description Khởi tạo một bản ghi thống kê mới trong Database.
   * @param {UserTopicStatisticsEntity} entity - Thực thể cần lưu.
   * @returns {Promise<UserTopicStatisticsEntity>} Thực thể sau khi đã Persistence thành công.
   */
  create(entity: UserTopicStatisticsEntity): Promise<UserTopicStatisticsEntity>;

  /**
   * @description Cập nhật các chỉ số của bản ghi hiện có.
   * @param {UserTopicStatisticsEntity} entity - Thực thể mang dữ liệu cập nhật.
   * @returns {Promise<UserTopicStatisticsEntity>} Thực thể với trạng thái mới nhất từ DB.
   */
  update(entity: UserTopicStatisticsEntity): Promise<UserTopicStatisticsEntity>;
}
