/**
 * @interface IUserStatisticsRecord
 * @description Bản ghi Thống kê người dùng - Khớp chính xác với cấu trúc dữ liệu trong Database (Prisma).
 * Đại diện cho dữ liệu thô (Raw Data) sau khi được truy vấn hoặc trước khi lưu trữ.
 */
export interface IUserStatisticsRecord {
  readonly userId: string; // Khóa chính (Primary Key)

  // --- NHÓM CHỈ SỐ BÀI THI (EXAM TOTALS) ---
  readonly totalExams: number;
  readonly passedExams: number;
  readonly failedExams: number;
  readonly failedByCritical: number; // Trượt do câu điểm liệt

  // --- NHÓM CHI TIẾT CÂU HỎI (QUESTION METRICS) ---
  readonly totalQuestionsAnswered: number;
  readonly totalCorrectAnswers: number;
  readonly totalWrongAnswers: number;
  readonly totalUnanswered: number;

  // --- NHÓM HIỆU SUẤT ĐIỂM SỐ (SCORE PERFORMANCE) ---
  readonly averageScore: number;
  readonly highScore: number;
  readonly highScoreExamId: string | null;
  readonly highScoreExamName: string | null; // Lưu tên để hiển thị Dashboard nhanh
  readonly lowScore: number;
  readonly lowScoreExamId: string | null;
  readonly lowScoreExamName: string | null;

  // --- NHÓM HIỆU SUẤT THỜI GIAN (TIME PERFORMANCE - SECONDS) ---
  readonly averageDuration: number;
  readonly fastestDuration: number;
  readonly fastestExamId: string | null;
  readonly fastestExamName: string | null;
  readonly slowestDuration: number;

  // --- NHÓM PHONG ĐỘ & XẾP HẠNG (STREAKS & RANK) ---
  readonly currentStreak: number; // Chuỗi đạt liên tiếp hiện tại
  readonly maxStreak: number;     // Kỷ lục chuỗi đạt dài nhất
  readonly currentRank: string | null;

  // --- DẤU THỜI GIAN (TIMESTAMPS) ---
  readonly lastExamAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}