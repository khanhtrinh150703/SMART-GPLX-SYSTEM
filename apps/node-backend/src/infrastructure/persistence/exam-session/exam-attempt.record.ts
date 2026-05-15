import { IExamSnapshot } from "@/domain/entities/exam-attempt/exam-attempt.props";

/**
 * @description Interface mô tả cấu trúc Record lưu trữ trong MongoDB (NoSQL).
 * Được đồng bộ hóa với Schema và Entity để đảm bảo Zero-Any.
 */
export interface IExamAttemptPersistence {
  readonly _id: string;
  readonly userId: string;
  readonly userName: string; // Phục vụ Leaderboard (Denormalization)
  readonly examId: string;
  readonly licenseCategoryId: string; // Phục vụ lọc theo hạng bằng (A1, B2...)
  readonly licenseCategoryName: string;

  // Kết quả chi tiết (Đã cập nhật)
  readonly score: number; // Điểm số thực tế (Số câu đúng)
  readonly correctCount: number; // Đồng nhất với score
  readonly wrongCount: number; // (Mới) Số câu trả lời sai
  readonly skippedCount: number; // (Mới) Số câu bỏ trống/không trả lời
  readonly totalQuestions: number; // Tổng số câu trong đề thi
  readonly passingScore: number;
  readonly isPassed: boolean; // Trạng thái đạt/không đạt
  readonly hasFailedCritical: boolean; // (Mới) Bị trượt do sai câu điểm liệt

  // Metadata thời gian và trạng thái
  readonly durationSeconds: number; // Tổng thời gian làm bài (giây)
  readonly isAutoSubmit: boolean; // Hệ thống tự nộp hay user bấm nộp
  readonly submittedAt: Date; // Thời điểm nộp bài chính xác
  readonly totalTimeExam: number; // Tổng thời gian bài thi (phút)

  // Dữ liệu nội dung (Snapshot)
  readonly snapshot: IExamSnapshot; // Lưu toàn bộ nội dung câu hỏi/đáp án lúc thi

  // Quản lý dòng đời dữ liệu
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}
