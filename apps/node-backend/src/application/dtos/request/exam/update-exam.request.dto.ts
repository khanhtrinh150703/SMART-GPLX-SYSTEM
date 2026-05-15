import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật đề thi.
 * Hầu hết các trường là optional vì đây là thao tác cập nhật từng phần (Partial Update).
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
 * @description DTO xử lý cập nhật thông tin đề thi.
 * Đảm bảo tính toàn vẹn của dữ liệu và các ràng buộc logic giữa các con số.
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
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu
    this.id = data.id;
    if (data.name !== undefined) this.name = data.name.trim();
    if (data.userId !== undefined) this.userId = data.userId;
    if (data.examMatrixId !== undefined) this.examMatrixId = data.examMatrixId;
    if (data.licenseCategoryId !== undefined) this.licenseCategoryId = data.licenseCategoryId;

    if (data.totalQuestions !== undefined) this.totalQuestions = Number(data.totalQuestions);
    if (data.passingScore !== undefined) this.passingScore = Number(data.passingScore);
    if (data.durationMinutes !== undefined) this.durationMinutes = Number(data.durationMinutes);
    if (data.minCriticalQuestions !== undefined) this.minCriticalQuestions = Number(data.minCriticalQuestions);

    if (data.status !== undefined) this.status = data.status;
    if (data.score !== undefined) this.score = Number(data.score);
    if (data.isPassed !== undefined) this.isPassed = data.isPassed;

    if (data.startedAt !== undefined) this.startedAt = new Date(data.startedAt);
    if (data.endedAt !== undefined) this.endedAt = data.endedAt ? new Date(data.endedAt) : null;

    this.questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];
  }

  /**
   * @description Hàm gác cổng thực hiện kiểm tra logic đa tầng.
   * @private
   */
  private validate(data: IUpdateExamInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Kiểm tra ID bắt buộc
    if (!data.id || data.id.trim() === '') {
      throw new AppError(ErrorCode.EXAM.ID_REQUIRED);
    }

    // 2. Kiểm tra tính hiện diện của các trường (nếu cung cấp)
    if (data.name !== undefined && data.name.trim() === '') {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    if (data.userId !== undefined && !data.userId) {
      throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
    }

    // 3. Kiểm tra logic con số
    if (data.durationMinutes !== undefined && Number(data.durationMinutes) <= 0) {
      throw new AppError(ErrorCode.EXAM.INVALID_DURATION);
    }

    if (data.totalQuestions !== undefined && Number(data.totalQuestions) <= 0) {
      throw new AppError(ErrorCode.EXAM.TOTAL_QUESTIONS_INVALID);
    }

    // 4. Kiểm tra logic chéo
    const questionCount = data.questionIds?.length || 0;
    if (data.passingScore !== undefined && questionCount > 0) {
      if (Number(data.passingScore) > questionCount) {
        throw new AppError(ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH);
      }
    }

    if (data.minCriticalQuestions !== undefined && Number(data.minCriticalQuestions) < 0) {
      throw new AppError(ErrorCode.EXAM.MIN_CRITICAL_INVALID);
    }

    // 5. Kiểm tra logic thời gian
    if (data.startedAt && data.endedAt) {
      const start = new Date(data.startedAt).getTime();
      const end = new Date(data.endedAt).getTime();
      if (end <= start) {
        throw new AppError(ErrorCode.EXAM.INVALID_TIME_RANGE);
      }
    }
  }
}