import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào cho luồng Import câu hỏi.
 */
export interface IImportQuestionInputDTO {
  readonly chapterId: string;
  readonly categoryId: string[];
  readonly content: string;
  readonly difficultyLevel: number;
  readonly indexNumber: number;
  readonly isCritical: boolean;
  readonly imageLocalPath?: string;
  readonly answers: {
    readonly content: string;
    readonly isCorrect: boolean;
    readonly imageLocalPath?: string;
  }[];
}

/**
 * @description DTO xử lý Import câu hỏi từ file/dữ liệu thô.
 */
export class ImportQuestionRequestDTO implements IImportQuestionInputDTO {
  public readonly chapterId: string;
  public readonly categoryId: string[];
  public readonly content: string;
  public readonly difficultyLevel: number;
  public readonly indexNumber: number;
  public readonly isCritical: boolean;
  public readonly imageLocalPath?: string;
  public readonly answers: {
    readonly content: string;
    readonly isCorrect: boolean;
    readonly imageLocalPath?: string;
  }[];

  constructor(data: IImportQuestionInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    this.chapterId = data.chapterId;
    this.categoryId = Array.isArray(data.categoryId) ? data.categoryId : [];
    this.content = data.content?.trim() || "";
    this.difficultyLevel = Number(data.difficultyLevel);
    this.indexNumber = Number(data.indexNumber);
    this.isCritical = Boolean(data.isCritical);
    this.imageLocalPath = data.imageLocalPath?.trim();

    this.answers = Array.isArray(data.answers)
      ? data.answers.map((ans) => ({
          content: ans.content?.trim() || "",
          isCorrect: Boolean(ans.isCorrect),
          imageLocalPath: ans.imageLocalPath?.trim(),
        }))
      : [];

    this.validate();
  }

  /**
   * @description Kiểm tra logic ràng buộc của câu hỏi và danh sách đáp án dựa trên dữ liệu instance.
   */
  private validate(): void {
    const { QUESTION } = ErrorCode;

    if (!this.chapterId) {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }

    if (!isUUID(this.chapterId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (this.categoryId.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    for (const id of this.categoryId) {
      if (!isUUID(id)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    if (this.content.length === 0) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }

    if (isNaN(this.difficultyLevel) || this.difficultyLevel < 0) {
      throw new AppError(QUESTION.DIFFICULTY_INVALID);
    }

    if (isNaN(this.indexNumber) || this.indexNumber < 0) {
      throw new AppError(QUESTION.INDEX_INVALID);
    }

    if (this.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    let correctCount = 0;
    for (const ans of this.answers) {
      if (ans.content.length === 0) {
        throw new AppError(QUESTION.ANSWER_CONTENT_REQUIRED);
      }
      if (ans.isCorrect) {
        correctCount++;
      }
    }

    if (correctCount === 0) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
  }
}
