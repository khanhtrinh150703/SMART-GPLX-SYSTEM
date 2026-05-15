import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật đề thi (Partial Update).
 */
export interface IUpdateExamInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly userId?: string;
  readonly examMatrixId?: string | null;
  readonly licenseCategoryId?: string;
  readonly totalQuestions?: number;
  readonly passingScore?: number;
  readonly durationMinutes?: number;
  readonly minCriticalQuestions?: number;
  readonly status?: Status;
  readonly score?: number;
  readonly isPassed?: boolean;
  readonly startedAt?: Date | string;
  readonly endedAt?: Date | string | null;
  readonly questionIds?: string[];
}

/**
 * @description DTO xử lý và kiểm tra tính toàn vẹn của dữ liệu cập nhật đề thi.
 */
export class UpdateExamRequestDTO implements IUpdateExamInputDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly userId?: string;
  public readonly examMatrixId?: string | null;
  public readonly licenseCategoryId?: string;
  public readonly totalQuestions?: number;
  public readonly passingScore?: number;
  public readonly durationMinutes?: number;
  public readonly minCriticalQuestions?: number;
  public readonly status?: Status;
  public readonly score?: number;
  public readonly isPassed?: boolean;
  public readonly startedAt?: Date;
  public readonly endedAt?: Date | null;
  public readonly questionIds: string[];

  constructor(data: IUpdateExamInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    this.id = data.id;
    if (data.name !== undefined) this.name = data.name.trim();
    if (data.userId !== undefined) this.userId = data.userId;
    if (data.examMatrixId !== undefined) this.examMatrixId = data.examMatrixId;
    if (data.licenseCategoryId !== undefined)
      this.licenseCategoryId = data.licenseCategoryId;

    if (data.totalQuestions !== undefined)
      this.totalQuestions = Number(data.totalQuestions);
    if (data.passingScore !== undefined)
      this.passingScore = Number(data.passingScore);
    if (data.durationMinutes !== undefined)
      this.durationMinutes = Number(data.durationMinutes);
    if (data.minCriticalQuestions !== undefined)
      this.minCriticalQuestions = Number(data.minCriticalQuestions);

    if (data.status !== undefined) this.status = data.status;
    if (data.score !== undefined) this.score = Number(data.score);
    if (data.isPassed !== undefined) this.isPassed = data.isPassed;

    if (data.startedAt !== undefined) this.startedAt = new Date(data.startedAt);
    if (data.endedAt !== undefined)
      this.endedAt = data.endedAt ? new Date(data.endedAt) : null;

    this.questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ đa tầng dựa trên dữ liệu instance.
   */
  private validate(): void {
    if (!this.id || this.id.trim() === "") {
      throw new AppError(ErrorCode.EXAM.ID_REQUIRED);
    }

    if (!isUUID(this.id)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (this.name !== undefined && this.name === "") {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    if (this.userId !== undefined) {
      if (!this.userId || this.userId.trim() === "") {
        throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
      }
      if (!isUUID(this.userId)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    if (this.examMatrixId) {
      if (!isUUID(this.examMatrixId)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    if (this.licenseCategoryId) {
      if (!isUUID(this.licenseCategoryId)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    if (this.durationMinutes !== undefined && this.durationMinutes <= 0) {
      throw new AppError(ErrorCode.EXAM.INVALID_DURATION);
    }

    if (this.totalQuestions !== undefined && this.totalQuestions <= 0) {
      throw new AppError(ErrorCode.EXAM.TOTAL_QUESTIONS_INVALID);
    }

    if (
      this.minCriticalQuestions !== undefined &&
      this.minCriticalQuestions < 0
    ) {
      throw new AppError(ErrorCode.EXAM.MIN_CRITICAL_INVALID);
    }

    const questionCount = this.questionIds.length;
    if (this.passingScore !== undefined && questionCount > 0) {
      if (this.passingScore > questionCount) {
        throw new AppError(ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH);
      }
    }

    if (this.startedAt && this.endedAt) {
      if (this.endedAt.getTime() <= this.startedAt.getTime()) {
        throw new AppError(ErrorCode.EXAM.INVALID_TIME_RANGE);
      }
    }

    if (this.questionIds.length > 0) {
      for (const qId of this.questionIds) {
        if (!isUUID(qId)) {
          throw new AppError(
            ErrorCode.VALIDATION.INVALID_FORMAT,
            "Mã định danh Câu hỏi trong danh sách sai định dạng UUID.",
          );
        }
      }
    }
  }
}
