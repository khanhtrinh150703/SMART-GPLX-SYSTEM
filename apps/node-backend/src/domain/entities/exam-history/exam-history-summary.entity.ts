import { BaseEntity } from "@/domain/seedwork/entity.base";

import { AppError, ErrorCode } from "@/shared/errors";
import {
  CreateExamHistorySummaryProps,
  IExamHistorySummaryProps,
} from "./exam-history-summary.props";

export class ExamHistorySummaryEntity extends BaseEntity<IExamHistorySummaryProps> {
  private constructor(props: IExamHistorySummaryProps) {
    super(props);
    this.validate();
  }

  /**
   * @description Factory Method: Khởi tạo một bản ghi lịch sử thi mới.
   */
  public static create(
    props: CreateExamHistorySummaryProps,
  ): ExamHistorySummaryEntity {
    const now = new Date();
    const finalizedProps: IExamHistorySummaryProps = {
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return new ExamHistorySummaryEntity(finalizedProps);
  }

  /**
   * @description Resurrection: Tái tạo thực thể từ MySQL.
   */
  public static reconstitute(
    props: IExamHistorySummaryProps,
  ): ExamHistorySummaryEntity {
    return new ExamHistorySummaryEntity(props);
  }

  /** @description Cập nhật dấu thời gian thay đổi cuối cùng. */
  private touch(): void {
    this._props.updatedAt = new Date();
  }

  /**
   * @description Invariants: Kiểm tra tính toàn vẹn dữ liệu và quy tắc nghiệp vụ của bản ghi lịch sử.
   * (Dịch: Check data integrity and business rules for history records).
   */
  private validate(): void {
    const {
      userId,
      snapshotId,
      licenseCategoryId,
      licenseCategoryName,
      score,
      totalQuestions,
      durationSeconds,
      isPassed,
    } = this.props;

    const { EXAM_HISTORY: EH } = ErrorCode;

    // 1. Kiểm tra tính hiện diện (Existence Invariants)
    // Đảm bảo các định danh không bao giờ được phép rỗng trong Domain
    if (!userId) throw new AppError(EH.USER_ID_REQUIRED);
    if (!snapshotId) throw new AppError(EH.SNAPSHOT_ID_REQUIRED);
    if (!licenseCategoryId || !licenseCategoryName) {
      throw new AppError(EH.CATEGORY_INFO_REQUIRED);
    }

    // 2. Logic về số lượng (Numeric Invariants)
    if (totalQuestions <= 0) {
      throw new AppError(EH.TOTAL_QUESTIONS_INVALID);
    }

    if (score < 0 || score > totalQuestions) {
      throw new AppError(EH.INVALID_SCORE);
    }

    // Nếu bài thi đã nộp thì thời gian không thể là số âm
    if (durationSeconds < 0) {
      throw new AppError(EH.INVALID_DURATION);
    }

    // 3. Logic trạng thái (Consistency Invariants)
    if (typeof isPassed !== "boolean") {
      throw new AppError(EH.RESULT_STATUS_REQUIRED);
    }
  }

  /**
   * @description Kiểm tra trạng thái xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  /**
   * @description Getters để Mapper truy cập dữ liệu (Read-only)
   */
  public get userId(): string {
    return this.props.userId;
  }
  public get licenseCategoryId(): string {
    return this.props.licenseCategoryId;
  }
  public get licenseCategoryName(): string {
    return this.props.licenseCategoryName;
  }
  public get score(): number {
    return this.props.score;
  }
  public get totalQuestions(): number {
    return this.props.totalQuestions;
  }
  public get isPassed(): boolean {
    return this.props.isPassed;
  }
  public get durationSeconds(): number {
    return this.props.durationSeconds;
  }
  public get snapshotId(): string {
    return this.props.snapshotId;
  }
  public get examName(): string {
    return this.props.examName;
  }
  public get createdAt(): Date | null {
    return this.props.createdAt ?? null;
  }
  public get updatedAt(): Date | null {
    return this.props.updatedAt ?? null;
  }
  public get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  public softDelete(): void {
    this._props.deletedAt = new Date();
    this.touch();
  }

  // Helper để lấy nhanh tóm tắt (như bạn đã viết)
  public get summary() {
    return {
      score: this.props.score,
      isPassed: this.props.isPassed,
      totalQuestions: this.props.totalQuestions,
      createdAt: this.props.createdAt,
    };
  }
}
