import { AppError, ErrorCode } from "@/shared/errors";

// 1. Định nghĩa interface cho từng câu trả lời
export interface IUserAnswerDTO {
  readonly questionId: string;
  readonly answer: number; 
}

// 2. Chuyển sang dùng Class hoàn chỉnh để tận dụng method isValid
export class CompleteExamInputDTO {
  constructor(
    public readonly examId: string,
    public readonly answers: IUserAnswerDTO[]
  ) {}

  /**
   * @description Kiểm tra tính toàn vẹn và hợp lệ của dữ liệu đầu vào.
   */
  public isValid(): void {
    // 1. Kiểm tra examId
    if (!this.examId) {
      throw new AppError(ErrorCode.EXAM_ATTEMPT.ID_REQUIRED);
    }

    // 2. Chặn mảng rỗng hoặc không phải mảng
    if (!Array.isArray(this.answers) || this.answers.length === 0) {
      throw new AppError(ErrorCode.EXAM.ANSWERS_EMPTY);
    }

    const questionIds = new Set<string>();

    for (const ans of this.answers) {
      // 3. Kiểm tra định dạng từng object (Thiếu questionId hoặc answer không phải số)
      if (!ans.questionId || typeof ans.answer !== 'number') {
        throw new AppError(ErrorCode.EXAM.ANSWER_FORMAT_INVALID);
      }

      // 4. Kiểm tra giá trị đáp án (phải là số nguyên dương)
      if (ans.answer <= 0 || !Number.isInteger(ans.answer)) {
        throw new AppError(ErrorCode.EXAM.ANSWER_FORMAT_INVALID);
      }

      // 5. Check trùng lặp questionId trong cùng một lần nộp bài
      if (questionIds.has(ans.questionId)) {
        throw new AppError(ErrorCode.EXAM.ANSWER_FORMAT_INVALID);
      }

      questionIds.add(ans.questionId);
    }
  }
}

export interface ICompleteExamInputDTO {
  readonly examId: string;
}

export interface ICompleteExamResponseDTO {
  readonly attemptId: string;
  readonly score: number;
  readonly isPassed: boolean;
  readonly submittedAt: Date;
}

export interface ICompleteExamService {
  execute(userId: string, dto: ICompleteExamInputDTO): Promise<ICompleteExamResponseDTO>;
}