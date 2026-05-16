import { IUserStatisticsResponseDTO } from "@/application/dtos/response/statistics/user-statistics.response.dto";

/**
 * @interface IUserStatisticsQueryService
 * @description Dịch vụ truy vấn thống kê và thứ hạng (Read-only).
 * Tập trung vào việc cung cấp dữ liệu nhanh cho UI/UX.
 */
export interface IUserStatisticsQueryService {
  /**
   * @description Lấy tổng quan thống kê của một người dùng (Số bài thi, điểm cao nhất, tỷ lệ đậu).
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<IUserStatisticsResponseDTO>} DTO chứa các chỉ số hiệu suất.
   */
  getUserSummary(userId: string): Promise<IUserStatisticsResponseDTO>;
}
