import { UserExamRankEntity } from "@/domain/entities/user-rank/user-exam-rank.entity";

/**
 * @description Giao diện lưu trữ kỷ lục người dùng (Mở rộng).
 * Đảm bảo tính trừu tượng và khả năng mở rộng cho hệ thống Ranking.
 */
export interface IUserExamRankRepository {
  /**
   * @description Tìm kỷ lục duy nhất của một người dùng theo đề thi.
   */
  findByUserAndExam(
    userId: string,
    examId: string,
  ): Promise<UserExamRankEntity | null>;

  /**
   * @description Lấy danh sách kỷ lục dựa trên một mảng ID người dùng (Dùng chung với Redis).
   * @param userIds - Mảng chứa các ID người dùng.
   * @param examId - ID của đề thi.
   * @returns {Promise<UserExamRankEntity[]>} - Danh sách thực thể (Đã qua Mapper DbModel -> Entity).
   */
  findByUserIdsAndExam(
    userIds: string[],
    examId: string,
  ): Promise<UserExamRankEntity[]>;
  
  /**
   * @description Lưu kỷ lục mới vào cơ sở dữ liệu.
   */
  save(entity: UserExamRankEntity): Promise<void>;

  /**
   * @description Cập nhật kỷ lục đã tồn tại.
   */
  update(entity: UserExamRankEntity): Promise<void>;

  /**
   * @description Lấy danh sách bảng xếp hạng cho một đề thi cụ thể.
   * Sắp xếp: score DESC, fastestSeconds ASC.
   */
  getLeaderboardByExam(
    examId: string,
    limit: number,
  ): Promise<UserExamRankEntity[]>;

  /**
   * @description Lấy danh sách bảng xếp hạng theo hạng bằng lái.
   */
  getLeaderboardByCategory(
    licenseCategoryId: string,
    limit: number,
  ): Promise<UserExamRankEntity[]>;

  // --- CÁC PHƯƠNG THỨC BỔ SUNG ---

  /**
   * @description Đếm số lượng người có thành tích tốt hơn để xác định vị trí thứ hạng.
   * Công thức: (score > currentScore) OR (score == currentScore AND durationSeconds < currentDuration).
   * @param examId ID đề thi.
   * @param score Điểm hiện tại của user.
   * @param durationSeconds Thời gian hiện tại của user.
   * @returns {Promise<number>} Số người đứng trên + 1 = Thứ hạng hiện tại.
   */
  countBetterRanks(
    examId: string,
    score: number,
    durationSeconds: number,
  ): Promise<number>;

  /**
   * @description Lấy tất cả kỷ lục "tốt nhất" của một người dùng trên mọi đề thi.
   * Phục vụ hiển thị Profile hoặc danh sách chứng chỉ đã đạt.
   */
  findAllByUser(userId: string): Promise<UserExamRankEntity[]>;

  /**
   * @description Kiểm tra xem người dùng đã từng thi đề này chưa.
   * Tối ưu hiệu suất thay vì find rắc rối.
   */
  exists(userId: string, examId: string): Promise<boolean>;

  /**
   * @description Xóa kỷ lục (Thường dùng cho mục đích Reset hoặc Admin).
   */
  delete(id: string): Promise<void>;
}
