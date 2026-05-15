import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @interface IQuestionStatisticsProps
 * @description Thuộc tính Aggregate Root Thống kê câu hỏi toàn hệ thống.
 * Theo dõi độ khó thực tế và tốc độ phản hồi trung bình của cộng đồng.
 */
export interface IQuestionStatisticsProps extends IBaseProps {
  /** @description ID định danh (Ánh xạ từ question_id trong DB)  */
  id: string;

  // --- ATTEMPT METRICS ---
  /** @description Tổng số lượt tương tác với câu hỏi này*/
  totalAttempts: number;

  /** @description Tổng số lần trả lời đúng*/
  correctCount: number;

  /** @description Tổng số lần trả lời sai */
  wrongCount: number;

  /** @description Tổng số lần bị bỏ qua */
  unansweredCount: number;

  // --- TIME METRICS ---
  /** @description Tổng thời gian phản hồi tích lũy (giây)  */
  totalDurationSum: number;

  /** @description Thời gian phản hồi trung bình (giây/câu) */
  averageDuration: number;

  // --- ANALYTICS ---
  /** @description Tỷ lệ chính xác toàn cục (0 - 100) */
  accuracyRate: number;

  /** @description Tỷ lệ sai sót toàn cục (0 - 100)  */
  errorRate: number;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description DTO khởi tạo Thống kê câu hỏi.
 * Tập trung vào các trường dữ liệu thô (Raw Data) để Entity tự tính toán các tỷ lệ.
 */
export type CreateQuestionStatisticsRequestProps = Pick<
  IQuestionStatisticsProps,
  | "id" // Cần ID câu hỏi ngay từ đầu để mapping
  | "totalAttempts"
  | "correctCount"
  | "wrongCount"
  | "unansweredCount"
  | "totalDurationSum"
>;

/**
 * @interface IQuestionAttemptRequest
 * @description Đại diện cho kết quả của một câu hỏi đơn lẻ trong danh sách gửi về.
 */
export interface IQuestionAttemptRequest {
  questionId: string;
  isCorrect: boolean;

  /** @description Thời gian làm câu này (giây)  */
  duration: number;

  /** @description Trạng thái có bỏ qua câu hỏi không  */
  isUnanswered?: boolean;
}

/**
 * @interface IRecordBulkAttemptsRequest
 * @description DTO dùng để gửi hàng loạt kết quả về cho Service xử lý.
 */
export interface IRecordBulkAttemptsRequest {
  attempts: IQuestionAttemptRequest[];
}
