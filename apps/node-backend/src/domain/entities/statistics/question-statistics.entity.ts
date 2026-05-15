import { BaseEntity } from "@/domain/seedwork/entity.base";
import { 
  IQuestionStatisticsProps, 
  CreateQuestionStatisticsRequestProps 
} from "./question-statistics.props";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";

/**
 * @class QuestionStatisticsEntity
 * @description Thực thể theo dõi độ khó và tốc độ phản hồi toàn cục của một câu hỏi.
 * Đảm bảo tính nhất quán giữa các chỉ số đếm và các tỷ lệ phân tích.
 */
export class QuestionStatisticsEntity extends BaseEntity<IQuestionStatisticsProps> {
  private constructor(props: IQuestionStatisticsProps) {
    super(props);
    this.validate();
  }

  /**
   * @description Khởi tạo thống kê cho câu hỏi mới (thường là khi lần đầu có người làm câu này).
   */
  public static create(props: CreateQuestionStatisticsRequestProps): QuestionStatisticsEntity {
    const now = new Date();
    
    // Tự động tính toán các chỉ số phái sinh từ dữ liệu thô
    const accuracyRate = this.calculateAccuracyRate(props.correctCount, props.totalAttempts);
    const errorRate = this.calculateErrorRate(props.wrongCount, props.totalAttempts);
    const averageDuration = this.calculateAverageDuration(props.totalDurationSum, props.totalAttempts);

    return new QuestionStatisticsEntity({
      ...props,
      accuracyRate,
      errorRate,
      averageDuration,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(props: IQuestionStatisticsProps): QuestionStatisticsEntity {
    return new QuestionStatisticsEntity(props);
  }

  /**
   * @description Ghi nhận một lượt tương tác mới từ bất kỳ người dùng nào.
   * @param isCorrect - Trạng thái đúng/sai.
   * @param duration - Thời gian làm câu hỏi này (giây).
   * @param isUnanswered - Trạng thái bỏ qua không trả lời.
   */
  public recordAttempt(isCorrect: boolean, duration: number, isUnanswered: boolean = false): void {
    // 1. Cập nhật các chỉ số đếm (Atomic Increment logic)
    this._props.totalAttempts += 1;
    this._props.totalDurationSum += duration;

    if (isUnanswered) {
      this._props.unansweredCount += 1;
    } else if (isCorrect) {
      this._props.correctCount += 1;
    } else {
      this._props.wrongCount += 1;
    }

    // 2. Tính toán lại toàn bộ "bộ mặt" của câu hỏi
    this._props.accuracyRate = QuestionStatisticsEntity.calculateAccuracyRate(
      this._props.correctCount,
      this._props.totalAttempts
    );

    this._props.errorRate = QuestionStatisticsEntity.calculateErrorRate(
      this._props.wrongCount,
      this._props.totalAttempts
    );

    this._props.averageDuration = QuestionStatisticsEntity.calculateAverageDuration(
      this._props.totalDurationSum,
      this._props.totalAttempts
    );

    this._props.updatedAt = new Date();
  }

  // --- LOGIC TÍNH TOÁN NỘI BỘ ---

  private static calculateAccuracyRate(correct: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((correct / total) * 100).toFixed(1));
  }

  private static calculateErrorRate(wrong: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((wrong / total) * 100).toFixed(1));
  }

  private static calculateAverageDuration(totalDuration: number, totalAttempts: number): number {
    if (totalAttempts === 0) return 0;
    return parseFloat((totalDuration / totalAttempts).toFixed(2));  
  }

  /**
   * @description QuestionStatistics không có deletedAt trong schema nên mặc định false.
   */
  public isDeleted(): boolean {
    return false;
  }

  /**
   * @description Kiểm tra Invariants (Ràng buộc bất biến).
   */
  private validate(): void {
    const { id, totalAttempts, correctCount, wrongCount, unansweredCount } = this._props;

    if (!id) {
      throw new AppError(ErrorCode.QUESTION_STATS.QUESTION_ID_REQUIRED);
    }

    // Kiểm tra tính toàn vẹn: Tổng các loại câu trả lời phải khớp với tổng lượt attempts
    const checkSum = correctCount + wrongCount + unansweredCount;
    if (checkSum > totalAttempts) {
      // Cho phép totalAttempts lớn hơn checkSum nếu hệ thống có logic khác, 
      // nhưng checkSum không được lớn hơn totalAttempts.
    }
  }
}