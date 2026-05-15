/**
 * @interface ILeaderboardCacheQueryService
 * @description Interface cung cấp các phương thức truy vấn bảng xếp hạng từ bộ nhớ đệm (Redis).
 */
export interface ILeaderboardCacheQueryService {
  /**
   * @description Lấy danh sách các User ID dẫn đầu bảng xếp hạng.
   * @param {string} examId - ID của kỳ thi cần truy vấn.
   * @param {number} limit - Số lượng người dùng dẫn đầu cần lấy.
   * @returns {Promise<string[]>} Danh sách các User ID có điểm số cao nhất.
   */
  getTopRankers(examId: string, limit: number): Promise<string[]>;

  /**
   * @description Lấy thứ hạng hiện tại của một người dùng trong kỳ thi.
   * @param {string} examId - ID của kỳ thi.
   * @param {string} userId - ID của người dùng cần kiểm tra.
   * @returns {Promise<number | null>} Thứ hạng (bắt đầu từ 1) hoặc null nếu không tồn tại.
   */
  getUserRank(examId: string, userId: string): Promise<number | null>;
}