/**
 * @description Hợp đồng lưu trữ bộ nhớ đệm cho bảng xếp hạng.
 * @principle Dependency Inversion - Tách biệt logic ứng dụng khỏi Redis.
 */
export interface ILeaderboardCacheRepository {
    /**
     * @description Cập nhật hoặc thêm mới thành tích của người dùng vào bảng xếp hạng.
     * @param examId ID của đề thi.
     * @param userId ID của người dùng.
     * @param score Điểm số thực tế đạt được.
     * @param durationSeconds Thời gian hoàn thành tính bằng giây.
     */
    upsertScore(examId: string, userId: string, score: number, durationSeconds: number): Promise<void>;

    /**
     * @description Lấy danh sách ID của những người đứng đầu bảng xếp hạng.
     * @param examId ID của đề thi.
     * @param limit Số lượng bản ghi cần lấy.
     * @returns Mảng chứa ID người dùng đã được sắp xếp.
     */
    getTopUserIds(examId: string, limit: number): Promise<string[]>;

    /**
     * @description Lấy thứ hạng hiện tại của một người dùng.
     * @param examId ID của đề thi.
     * @param userId ID của người dùng cần tra cứu.
     * @returns Thứ hạng (số nguyên dương) hoặc null nếu chưa có thành tích.
     */
    getUserRankPosition(examId: string, userId: string): Promise<number | null>;

    /**
     * @description Xóa toàn bộ dữ liệu bảng xếp hạng của một đề thi.
     * @param examId ID của đề thi cần xóa dữ liệu.
     */
    clearLeaderboard(examId: string): Promise<void>;
}