import { QuestionProps } from "./question.props";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @class Question
 * @description Thực thể Câu hỏi (Question Entity) trong hệ thống Smart-GPLX.
 */
export class Question {
  private readonly _props: QuestionProps;

  /**
   * @description Constructor riêng tư để đảm bảo tính đóng gói, sử dụng qua reconstitute.
   */
  private constructor(props: QuestionProps) {
    this._props = {
      ...props,
      difficultyLevel: props.difficultyLevel ?? 1,
      isCritical: props.isCritical ?? false,
      answers: props.answers ?? [],
      licenseCategoryIds: props.licenseCategoryIds ?? [],
    };

    // Tự động kiểm tra nghiệp vụ ngay khi khởi tạo
    this.validateQuestion();
  }

  /**
   * @description Phương thức tái tạo Entity từ dữ liệu thô (Persistence/DTO)
   */
  public static reconstitute(props: QuestionProps): Question {
    return new Question(props);
  }

  /**
   * @description Truy xuất các thuộc tính dưới dạng Readonly
   */
  public get props(): Readonly<QuestionProps> {
    return Object.freeze(this._props);
  }

  /**
   * @description Xác thực các ràng buộc nghiệp vụ (Invariants) của câu hỏi.
   * Sử dụng cơ chế AppError Lookup (ErrorCode -> Status & Message).
   * @throws {AppError} Nếu vi phạm quy tắc nghiệp vụ.
   */
  public validateQuestion(): void {
    const { QUESTION } = ErrorCode;

    // 1. Kiểm tra nội dung câu hỏi
    if (!this._props.content || this._props.content.trim().length < 10) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }

    // 2. Kiểm tra chương lý thuyết
    if (!this._props.chapterId) {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }

    // 3. Kiểm tra hạng bằng lái liên quan
    if (!this._props.licenseCategoryIds || this._props.licenseCategoryIds.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    // 4. Kiểm tra số lượng đáp án tối thiểu
    if (!this._props.answers || this._props.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    // 5. Kiểm tra đáp án đúng (Sử dụng some để tối ưu hiệu năng)
    const hasCorrectAnswer = this._props.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
  }

  /**
   * @description Kiểm tra xem đây có phải câu hỏi điểm liệt không
   */
  public isCritical(): boolean {
    return this._props.isCritical;
  }

  public delete(): void {
    const { QUESTION } = ErrorCode;
    if (this.isCritical()) {
      throw new AppError(QUESTION.CANNOT_DELETE_CRITICAL);
    }

    this._props.deletedAt = new Date();
  }

  public restore(): void {
    this._props.deletedAt = null;
  }
}