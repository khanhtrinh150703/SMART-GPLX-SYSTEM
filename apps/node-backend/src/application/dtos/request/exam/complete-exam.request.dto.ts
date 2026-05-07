import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu cho từng câu trả lời của người dùng.
 */
export interface IUserAnswerDTO {
  readonly questionId: string;
  readonly answer: number;
}

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu nộp bài thi (Bổ sung metadata thời gian).
 */
export interface ICompleteExamInputDTO {
  readonly examId: string;
  readonly answers: IUserAnswerDTO[];
  readonly timeSpent: number; // Thời gian đã làm bài (giây)
  readonly timeRemaining: number; // Thời gian còn lại (giây)
  readonly isAutoSubmit: boolean; // Nộp tự động do hết giờ hay chủ động nộp
  readonly clientFinishedAt: string; // Mốc thời gian kết thúc tại client (ISO String)
}

/**
 * @description DTO xử lý nộp bài và chấm điểm.
 * Quản lý tính toàn vẹn của dữ liệu bài làm và các thông số thời gian thực tế.
 */
export class CompleteExamInputRequestDTO implements ICompleteExamInputDTO {
  public readonly examId: string;
  public readonly answers: IUserAnswerDTO[];
  public readonly timeSpent: number;
  public readonly timeRemaining: number;
  public readonly isAutoSubmit: boolean;
  public readonly clientFinishedAt: string;

  constructor(data: ICompleteExamInputDTO) {
    // 1. Chặn đứng mọi dữ liệu không hợp lệ ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị (Dữ liệu đã qua kiểm duyệt)
    this.examId = data.examId.trim();
    this.answers = data.answers;
    this.timeSpent = data.timeSpent;
    this.timeRemaining = data.timeRemaining;
    this.isAutoSubmit = !!data.isAutoSubmit;
    this.clientFinishedAt = data.clientFinishedAt;
  }

  /**
   * @description Hàm gác cổng kiểm tra tính toàn vẹn của bài thi (Data Integrity).
   */
  private validate(data: ICompleteExamInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Kiểm tra mã đề thi
    if (!data.examId || typeof data.examId !== "string") {
      throw new AppError(ErrorCode.SESSION.INVALID_EXAM_ID);
    }

    // 2. Kiểm tra các trường thông tin thời gian (Must be non-negative numbers)
    // 2. Kiểm tra thời gian (Chuyển từ VALIDATION sang SESSION cụ thể)
    if (typeof data.timeSpent !== "number" || data.timeSpent < 0) {
      throw new AppError(ErrorCode.SESSION.INVALID_TIME_SPENT);
    }

    if (typeof data.timeRemaining !== "number" || data.timeRemaining < 0) {
      throw new AppError(ErrorCode.SESSION.INVALID_TIME_REMAINING);
    }

    // 3. Kiểm tra mốc thời gian kết thúc
    if (!data.clientFinishedAt || isNaN(Date.parse(data.clientFinishedAt))) {
      throw new AppError(ErrorCode.SESSION.INVALID_FINISHED_DATE);
    }

    // 4. Kiểm tra mảng câu trả lời
    if (!Array.isArray(data.answers) || data.answers.length === 0) {
      throw new AppError(ErrorCode.SESSION.ANSWERS_REQUIRED);
    }

    const questionIds = new Set<string>();

    for (const ans of data.answers) {
      if (!ans.questionId || typeof ans.answer !== "number") {
        throw new AppError(ErrorCode.SESSION.ANSWER_FORMAT_INVALID);
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
