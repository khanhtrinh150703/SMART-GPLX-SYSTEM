import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @interface IUserTopicStatisticsProps
 * @description Aggregate Root quản lý tiến độ, hiệu suất và tốc độ phản xạ của người dùng theo từng chủ đề kiến thức.
 */
export interface IUserTopicStatisticsProps extends IBaseProps {
  id: string;

  /** @description ID người dùng sở hữu thống kê này  */
  userId: string;

  /** @description ID của chủ đề (Luật, Biển báo...) */
  topicId: string;

  /** @description Tên hiển thị của chủ đề  */
  topicName: string;

  // --- QUESTION METRICS ---
  /** @description Tổng số câu hỏi hiện có trong chủ đề này  */
  totalQuestions: number;

  /** @description Số câu trả lời đúng  */
  correctAnswers: number;

  /** @description Số câu trả lời sai  */
  wrongAnswers: number;

  /** @description Số câu đã bỏ qua/chưa làm  */
  unanswered: number;

  // --- TIME METRICS ---
  /** @description Tổng thời gian làm bài tích lũy (giây)  */
  totalDurationSum: number;

  /** @description Thời gian phản hồi trung bình mỗi câu (giây/câu) */
  averageDuration: number;

  /** @description Số câu hỏi duy nhất đã từng làm trong chủ đề này (Tử số cho Progress Bar) */
  questionsAttempted: number;

  // --- ANALYTICS ---
  /** @description Tỷ lệ chính xác (%) */
  accuracyRate: number;

  /** @description Tỷ lệ lỗi (%) */
  errorRate: number;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Type hỗ trợ khởi tạo thống kê mới.
 * Thêm các trường metric cơ bản để Service có thể truyền vào khi người dùng làm bài lần đầu.
 */
export type CreateUserTopicStatisticsRequestProps = Pick<
  IUserTopicStatisticsProps,
  | "userId"
  | "topicId"
  | "topicName"
  | "totalQuestions"
  | "correctAnswers"
  | "wrongAnswers"
  | "unanswered"
  | "totalDurationSum"
  | "questionsAttempted"
>;

/**
 * @interface IUpdateStatsRequest
 * @description Dữ liệu cộng dồn từ một lượt thi để cập nhật thống kê chủ đề.
 */
export interface IUpdateStatsRequest {
  additionalAttempted: number;
  additionalCorrect: number;
  additionalWrong: number;
  additionalUnanswered: number;
  additionalDuration: number;
}
