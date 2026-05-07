/**
 * @description Giao diện quản lý bộ nhớ đệm bảng xếp hạng (Redis Speed Layer).
 * @principle High Performance - Tối ưu hóa tốc độ đọc bảng xếp hạng.
 */
export interface ILeaderboardCacheService {
  /** @description Cập nhật hoặc thêm mới thành tích vào Redis ZSET. */
  updateScore(params: {
    examId: string;
    userId: string;
    score: number;
    seconds: number;
  }): Promise<void>;

  /** @description Lấy danh sách Top người dẫn đầu từ Redis. */
  getTopRankers(examId: string, limit: number): Promise<string[]>;

  /** @description Lấy thứ hạng hiện tại của một User. */
  getUserRank(examId: string, userId: string): Promise<number | null>;
}
