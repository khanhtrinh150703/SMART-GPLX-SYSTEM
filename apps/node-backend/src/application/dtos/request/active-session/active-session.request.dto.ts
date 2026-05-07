import { ErrorCode } from "@/shared/errors";
import { AppError } from "@/shared/errors/error-app";

export interface IStartSessionInputDTO {
  readonly examId: string;
  readonly isForce: boolean;
}

export interface IUpdateAnswerInputDTO {
  readonly examId: string;
  readonly sessionId: string;
  readonly currentQuestionIndex: number;
  readonly answers: Record<string, number | null>; // Gửi cả map câu trả lời
  readonly clientTimestamp: string;
}

/** 
 * @description Đối tượng dữ liệu để bắt đầu phiên thi.
 * (Start Session Data Transfer Object)
 */
export class StartSessionRequestDTO implements IStartSessionInputDTO {
  readonly examId: string;
  readonly isForce: boolean;

  constructor(data: IStartSessionInputDTO) {
    this.validate(data);
    this.examId = data.examId;
    this.isForce = data.isForce;
  }

  private validate(data: IStartSessionInputDTO): void {
    if (!data) {
      throw new AppError(
        ErrorCode.SYSTEM.INVALID_INPUT,
      );
    }
    if (!data.examId || typeof data.examId !== 'string') {
      throw new AppError(
        ErrorCode.SESSION.INVALID_EXAM_ID,
      );
    }
  }
}

/**
 * @description DTO xử lý yêu cầu cập nhật câu trả lời từ máy khách.
 * Đảm bảo tính nhất quán giữa dữ liệu câu hỏi hiện tại và trạng thái toàn bộ bài thi.
 */
export class UpdateAnswerRequestDTO implements IUpdateAnswerInputDTO {
  readonly examId: string;
  readonly currentQuestionIndex: number;
  readonly answers: Record<string, number | null>;
  readonly clientTimestamp: string;
  readonly sessionId: string;

  constructor(data: IUpdateAnswerInputDTO) {
    this.validate(data);
    this.examId = data.examId;
    this.currentQuestionIndex = data.currentQuestionIndex;
    this.answers = data.answers;
    this.sessionId = data.sessionId;
    this.clientTimestamp = data.clientTimestamp;
  }

  private validate(data: IUpdateAnswerInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Kiểm tra examId và sessionId
    if (!data.examId) {
      throw new AppError(ErrorCode.SESSION.EXAM_ID_REQUIRED);
    }

    if (!data.sessionId) {
      throw new AppError(ErrorCode.SESSION.SESSION_ID_REQUIRED);
    }

    // 2. Kiểm tra answers (Phải là object và không được rỗng nếu nghiệp vụ yêu cầu)
    if (!data.answers || typeof data.answers !== 'object') {
      throw new AppError(ErrorCode.SESSION.ANSWER_FORMAT_INVALID);
    }

    // Nếu bạn đã định nghĩa ANSWERS_REQUIRED, nên dùng ở đây
    // if (Object.keys(data.answers).length === 0) {
    //   throw new AppError(ErrorCode.SESSION.ANSWERS_REQUIRED);
    // }

    // 3. Kiểm tra index (Phải là số và không được âm như mô tả SES_107)
    if (typeof data.currentQuestionIndex !== 'number' || data.currentQuestionIndex < 0) {
      throw new AppError(ErrorCode.SESSION.INVALID_QUESTION_INDEX);
    }

    // 4. Kiểm tra Timestamp
    if (!data.clientTimestamp) {
      throw new AppError(ErrorCode.SESSION.CLIENT_TIMESTAMP_REQUIRED);
    }
  }
}