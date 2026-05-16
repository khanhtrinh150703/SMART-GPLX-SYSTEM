import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu cho từng câu trả lời của người dùng.
 */
export interface IUserAnswerDTO {
  readonly questionId: string;
  readonly answer: number;
  readonly timeSpent: number;
}

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu nộp bài thi (Bổ sung metadata thời gian và phiên).
 */
export interface ICompleteExamInputDTO {
  readonly examId: string;
  readonly sessionId: string;
  readonly answers: IUserAnswerDTO[];
  readonly timeSpent: number;
  readonly timeRemaining: number;
  readonly isAutoSubmit: boolean;
  readonly shouldShuffle: boolean;
  readonly clientFinishedAt: string;
}

/**
 * @description DTO xử lý nộp bài và chấm điểm bài thi.
 */
export class CompleteExamInputRequestDTO implements ICompleteExamInputDTO {
  public readonly examId: string;
  public readonly sessionId: string;
  public readonly answers: IUserAnswerDTO[];
  public readonly timeSpent: number;
  public readonly timeRemaining: number;
  public readonly isAutoSubmit: boolean;
  public readonly shouldShuffle: boolean;
  public readonly clientFinishedAt: string;

  constructor(data: ICompleteExamInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    this.examId = data.examId?.trim() || "";
    this.sessionId = data.sessionId?.trim() || "";
    this.answers = Array.isArray(data.answers) ? data.answers : [];
    this.timeSpent = data.timeSpent;
    this.timeRemaining = data.timeRemaining;
    this.isAutoSubmit = !!data.isAutoSubmit;
    this.shouldShuffle = !!data.shouldShuffle;
    this.clientFinishedAt = data.clientFinishedAt?.trim() || "";

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính toàn vẹn của bài thi dựa trên dữ liệu instance.
   */
  private validate(): void {
    if (!this.examId || typeof this.examId !== "string") {
      throw new AppError(ErrorCode.SESSION.INVALID_EXAM_ID);
    }

    if (!isUUID(this.examId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (!this.sessionId || typeof this.sessionId !== "string") {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    if (!isUUID(this.sessionId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (typeof this.timeSpent !== "number" || this.timeSpent < 0) {
      throw new AppError(ErrorCode.SESSION.INVALID_TIME_SPENT);
    }

    if (typeof this.timeRemaining !== "number" || this.timeRemaining < 0) {
      throw new AppError(ErrorCode.SESSION.INVALID_TIME_REMAINING);
    }

    if (!this.clientFinishedAt || isNaN(Date.parse(this.clientFinishedAt))) {
      throw new AppError(ErrorCode.SESSION.INVALID_FINISHED_DATE);
    }

    if (this.answers.length === 0) {
      throw new AppError(ErrorCode.SESSION.ANSWERS_REQUIRED);
    }

    const questionIds = new Set<string>();

    for (const ans of this.answers) {
      if (!ans.questionId || typeof ans.answer !== "number") {
        throw new AppError(ErrorCode.SESSION.ANSWER_FORMAT_INVALID);
      }

      if (!isUUID(ans.questionId)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }

      if (ans.answer <= 0 || !Number.isInteger(ans.answer)) {
        throw new AppError(ErrorCode.SESSION.INVALID_ANSWER_VALUE);
      }

      if (questionIds.has(ans.questionId)) {
        throw new AppError(ErrorCode.SESSION.DUPLICATE_QUESTION);
      }

      questionIds.add(ans.questionId);
    }
  }
}
