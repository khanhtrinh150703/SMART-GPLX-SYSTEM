import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";

/**
 * @interface IUserStatisticsService
 * @description Dịch vụ điều phối việc cập nhật và đồng bộ dữ liệu thống kê (Command).
 */
export interface IUserStatisticsService {
  /**
   * @description Cập nhật các chỉ số thống kê ngay sau khi người dùng nộp bài thành công.
   * @param {SyncRankRequestDTO} payload - Dữ liệu thô từ kết quả thi vừa thực hiện.
   */
  syncUserStats(payload: SyncRankRequestDTO): Promise<void>;
}
