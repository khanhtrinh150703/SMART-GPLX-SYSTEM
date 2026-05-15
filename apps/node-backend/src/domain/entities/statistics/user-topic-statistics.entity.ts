import { BaseEntity } from "@/domain/seedwork/entity.base";

import {
  IUserTopicStatisticsProps,
  CreateUserTopicStatisticsRequestProps,
  IUpdateStatsRequest,
} from "./user-topic-statistics.props";
import { ErrorCode } from "@/shared/errors/error-codes";
import { AppError } from "@/shared/errors/error-app";

/**
 * @class UserTopicStatisticsEntity
 * @description Thực thể quản lý thống kê học tập của người dùng theo từng chủ đề.
 * Chứa logic tính toán tỷ lệ lỗi (errorRate) tự động.
 */
export class UserTopicStatisticsEntity extends BaseEntity<IUserTopicStatisticsProps> {
  private constructor(props: IUserTopicStatisticsProps) {
    super(props);
    this.validate();
  }

  /**
   * @description Khởi tạo thống kê chủ đề mới dựa trên kết quả của bài thi đầu tiên.
   * @param {CreateUserTopicStatisticsRequestProps} props - Dữ liệu thô từ Service.
   * @returns {UserTopicStatisticsEntity}
   */
  public static create(
    props: CreateUserTopicStatisticsRequestProps,
  ): UserTopicStatisticsEntity {
    const id = crypto.randomUUID();
    const now = new Date();

    // Tính toán toàn bộ bộ chỉ số phái sinh
    const accuracyRate = this.calculateAccuracyRate(
      props.correctAnswers,
      props.wrongAnswers,
    );
    const errorRate = this.calculateErrorRate(
      props.wrongAnswers,
      props.correctAnswers,
    );
    const averageDuration = this.calculateAverageDuration(
      props.totalDurationSum,
      props.correctAnswers + props.wrongAnswers,
    );

    return new UserTopicStatisticsEntity({
      ...props,
      id,
      accuracyRate,
      errorRate,
      averageDuration,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * @description Phục hồi thực thể từ dữ liệu Database (Persistence).
   */
  public static reconstitute(
    props: IUserTopicStatisticsProps,
  ): UserTopicStatisticsEntity {
    return new UserTopicStatisticsEntity(props);
  }

  /** @description Cập nhật dấu thời gian thay đổi cuối cùng. */
  private touch(): void {
    this._props.updatedAt = new Date();
  }

  /**
   * @description Cập nhật kết quả làm bài cho chủ đề.
   * Logic: Tăng tổng số câu và số câu sai (nếu có), sau đó tính lại tỷ lệ lỗi.
   */
  public updateProgress(isCorrect: boolean): void {
    this._props.totalQuestions += 1;
    if (!isCorrect) {
      this._props.wrongAnswers += 1;
    }
    this._props.errorRate = UserTopicStatisticsEntity.calculateErrorRate(
      this._props.wrongAnswers,
      this._props.totalQuestions,
    );
    this.touch();
  }

  /**
   * @description Cập nhật số liệu cộng dồn sau khi kết thúc một bài thi (Batch Update).
   */
  public updateStats(data: IUpdateStatsRequest): void {
    const {
      additionalCorrect,
      additionalWrong,
      additionalUnanswered,
      additionalDuration,
      additionalAttempted,
    } = data;
    // 1. Cập nhật các chỉ số thô (Raw Metrics)
    this._props.correctAnswers += additionalCorrect;
    this._props.wrongAnswers += additionalWrong;
    this._props.unanswered += additionalUnanswered;
    this._props.totalDurationSum += additionalDuration;
    this._props.questionsAttempted += additionalAttempted;
    
    // 2. Tính toán lại toàn bộ tỷ lệ (Derived Metrics)
    const totalAttempted =
      this._props.correctAnswers + this._props.wrongAnswers;

    this._props.accuracyRate = UserTopicStatisticsEntity.calculateAccuracyRate(
      this._props.correctAnswers,
      this._props.wrongAnswers,
    );

    this._props.errorRate = UserTopicStatisticsEntity.calculateErrorRate(
      this._props.wrongAnswers,
      this._props.correctAnswers,
    );

    this._props.averageDuration =
      UserTopicStatisticsEntity.calculateAverageDuration(
        this._props.totalDurationSum,
        totalAttempted,
      );

    this.touch();
  }

  // --- LOGIC TÍNH TOÁN (PRIVATE STATICS) ---

  private static calculateAccuracyRate(correct: number, wrong: number): number {
    const total = correct + wrong;
    if (total === 0) return 0;
    return parseFloat(((correct / total) * 100).toFixed(1));
  }

  private static calculateErrorRate(wrong: number, correct: number): number {
    const total = correct + wrong;
    if (total === 0) return 0;
    return parseFloat(((wrong / total) * 100).toFixed(1));
  }

  private static calculateAverageDuration(
    totalDuration: number,
    totalAttempted: number,
  ): number {
    if (totalAttempted === 0) return 0;
    return parseFloat((totalDuration / totalAttempted).toFixed(2));
  }

  /**
   * @description Kiểm tra tính hợp lệ của dữ liệu (Invariants).
   */
  private validate(): void {
    // 1. Kiểm tra tổng số câu không được âm
    if (this._props.totalQuestions < 0) {
      throw new AppError(ErrorCode.USER_TOPIC_STATS.TOTAL_QUESTIONS_NEGATIVE);
    }
   
  }
}
