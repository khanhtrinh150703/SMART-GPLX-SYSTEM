import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { STATUS, Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo bài thi thủ công.
 */
export interface ICreateManualExamInputDTO {
  readonly name: string;
  readonly userId: string;
  readonly licenseCategoryId: string;
  readonly examMatrixId?: string | null;
  readonly totalQuestions?: number;
  readonly passingScore: number;
  readonly durationMinutes: number;
  readonly minCriticalQuestions: number;
  readonly status?: Status;
  readonly score?: number;
  readonly isPassed?: boolean;
  readonly isChapter?: boolean;
  readonly startedAt?: Date | string;
  readonly endedAt?: Date | string | null;
  readonly questionIds: string[];
  readonly questions?: IExamQuestionProps[];
}

/**
 * @class CreateManualExamRequestDTO
 * @description DTO xử lý khởi tạo bài thi thủ công, thực hiện mapping trước khi validate.
 */
export class CreateManualExamRequestDTO implements ICreateManualExamInputDTO {
  public readonly name: string;
  public readonly userId: string;
  public readonly licenseCategoryId: string;
  public readonly examMatrixId: string | null;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly status: Status;
  public readonly score: number;
  public readonly isPassed: boolean;
  public readonly isChapter: boolean;
  public readonly startedAt: Date;
  public readonly endedAt: Date | null;
  public readonly questionIds: string[];
  public readonly questions?: IExamQuestionProps[];

  /**
   * @param {ICreateManualExamInputDTO} data
   * @throws {AppError}
   */
  constructor(data: ICreateManualExamInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Mapping & Sanitization (Gán sạch vào this trước)
    this.name = typeof data.name === "string" ? data.name.trim() : "";
    this.userId = typeof data.userId === "string" ? data.userId.trim() : "";
    this.licenseCategoryId =
      typeof data.licenseCategoryId === "string"
        ? data.licenseCategoryId.trim()
        : "";
    this.examMatrixId =
      typeof data.examMatrixId === "string" ? data.examMatrixId.trim() : null;

    this.durationMinutes =
      data.durationMinutes !== undefined && data.durationMinutes !== null
        ? Number(data.durationMinutes)
        : NaN;
    this.passingScore =
      data.passingScore !== undefined && data.passingScore !== null
        ? Number(data.passingScore)
        : NaN;
    this.minCriticalQuestions =
      data.minCriticalQuestions !== undefined &&
      data.minCriticalQuestions !== null
        ? Number(data.minCriticalQuestions)
        : NaN;

    this.status = data.status || STATUS.ACTIVE;
    this.score =
      data.score !== undefined && data.score !== null ? Number(data.score) : 0;
    this.isPassed = typeof data.isPassed === "boolean" ? data.isPassed : false;
    this.isChapter =
      typeof data.isChapter === "boolean" ? data.isChapter : false;

    this.startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
    this.endedAt = data.endedAt ? new Date(data.endedAt) : null;

    this.questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];
    this.totalQuestions =
      data.totalQuestions !== undefined && data.totalQuestions !== null
        ? Number(data.totalQuestions)
        : this.questionIds.length;
    this.questions = Array.isArray(data.questions) ? data.questions : undefined;

    // 2. Validation (Kiểm tra toàn bộ logic ràng buộc bằng thuộc tính của instance)
    this.validate();
  }

  /**
   * @private
   * @description Hàm gác cổng thực hiện kiểm tra logic hoàn toàn dựa trên 'this'.
   * @throws {AppError}
   */
  private validate(): void {
    // 1. Kiểm tra các trường định danh bắt buộc
    if (!this.name) {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    if (!this.userId) {
      throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
    }

    if (!this.licenseCategoryId) {
      throw new AppError(ErrorCode.EXAM.LICENSE_CATEGORY_REQUIRED);
    }

    if (!this.userId) {
      throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
    }
    if (!isUUID(this.userId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (!this.licenseCategoryId) {
      throw new AppError(ErrorCode.EXAM.LICENSE_CATEGORY_REQUIRED);
    }
    if (!isUUID(this.licenseCategoryId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    // 2. Kiểm tra logic danh sách câu hỏi
    const hasQuestionIds = this.questionIds.length > 0;
    const hasQuestionsSnapshot =
      Array.isArray(this.questions) && this.questions.length > 0;

    if (!hasQuestionIds && !hasQuestionsSnapshot) {
      throw new AppError(ErrorCode.EXAM.QUESTIONS_EMPTY);
    }

    // 3. Kiểm tra logic thông số số học
    if (isNaN(this.durationMinutes) || this.durationMinutes <= 0) {
      throw new AppError(ErrorCode.EXAM.INVALID_DURATION);
    }

    // Kiểm tra điểm đạt so với giới hạn câu hỏi thực tế
    const limit = this.questions?.length || this.questionIds.length;
    if (isNaN(this.passingScore) || this.passingScore > limit) {
      throw new AppError(ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH);
    }

    if (isNaN(this.minCriticalQuestions) || this.minCriticalQuestions < 0) {
      throw new AppError(ErrorCode.EXAM.MIN_CRITICAL_INVALID);
    }
  }
}
