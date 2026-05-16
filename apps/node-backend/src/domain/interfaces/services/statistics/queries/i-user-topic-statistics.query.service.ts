import { UserTopicStatisticsResponseDTO } from "@/application/dtos/response/statistics/user-topic-statistics.response.dto";

/**
 * @interface IUserTopicStatisticsQueryService
 * @description Quản lý các yêu cầu truy vấn (Queries) dữ liệu thống kê chủ đề.
 */
export interface IUserTopicStatisticsQueryService {
  /**
   * @description Lấy danh sách thống kê toàn bộ các chủ đề của một người dùng.
   * @param {string} userId - ID người dùng.
   * @returns {Promise<UserTopicStatisticsResponseDTO[]>} Danh sách DTO thống kê.
   */
  getStatisticsByUser(
    userId: string,
  ): Promise<UserTopicStatisticsResponseDTO[]>;

  /**
   * @description Lấy thống kê chi tiết của một chủ đề cụ thể cho người dùng.
   * @param {string} userId
   * @param {string} topicId
   */
  getSpecificTopicStats(
    userId: string,
    topicId: string,
  ): Promise<UserTopicStatisticsResponseDTO | null>;
}
