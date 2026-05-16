import { IUpdateUserTopicStatisticsCommand } from "@/application/dtos/request/statistics/update-user-topic-statistics.request.dto";

/**
 * @interface IUserTopicStatisticsService
 * @description Xử lý các lệnh thay đổi trạng thái thống kê chủ đề sau khi kết thúc bài thi.
 * Luồng chạy: Duy nhất một lần khi người dùng nhấn "Nộp bài".
 */
export interface IUserTopicStatisticsService {
  /**
   * @description Cập nhật hàng loạt tiến độ học tập dựa trên kết quả bài thi.
   * @param {IUpdateUserTopicStatisticsCommand} command - DTO chứa UserId và mảng Delta kết quả.
   * @returns {Promise<void>}
   */
  updateBulkProgress(command: IUpdateUserTopicStatisticsCommand): Promise<void>;
}