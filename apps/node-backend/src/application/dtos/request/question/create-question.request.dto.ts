import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Cấu trúc đáp án trong Payload sau khi xử lý (Processed answer payload structure)
 */
export interface CreateAnswerPayload {
  content: string;
  isCorrect: boolean;
  imageIndex?: number;
  imageFile?: IUploadedFile; // File vật lý sau khi được DTO ánh xạ (Mapped physical file)
}

/**
 * @description Giao diện cho dữ liệu thô nhận từ Controller (Raw input interface from Controller)
 */
export interface ICreateQuestionInput {
  chapterId: string;
  content: string;
  licenseCategoryIds: string | string[];
  answers: string; // Chuỗi JSON từ Frontend (JSON string from Frontend)
  isCritical: string | boolean;
  difficultyLevel: string | number;
  status: QuestionStatus; 
  imageFile?: IUploadedFile;       // Ảnh chính của câu hỏi (Main question image)
  answerFiles?: IUploadedFile[];   // Mảng ảnh đáp án lấy từ req.files (Array of answer images)
}

/**
 * @class CreateQuestionRequestDto
 * @description DTO vận chuyển dữ liệu tạo câu hỏi mới (DTO for transporting new question data)
 */
export class CreateQuestionRequestDto {
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: CreateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: QuestionStatus;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;

  constructor(data: ICreateQuestionInput) {
    // 1. Gán và ép kiểu cơ bản (Basic casting and assignment)
    this.chapterId = String(data.chapterId || '');
    this.content = String(data.content || '');
    this.imageFile = data.imageFile;
    this.difficultyLevel = Number(data.difficultyLevel) || 1;
    this.isCritical = String(data.isCritical) === 'true';
    this.status = data.status ?? 'ACTIVE';

    // 2. Xử lý mảng hạng bằng lái (License categories processing)
    this.licenseCategoryIds = this._parseArray<string>(data.licenseCategoryIds);

    // 3. Xử lý mảng answers & THỰC HIỆN ÁNH XẠ ẢNH (Answers processing & Image Mapping)
    const parsedAnswers = this._parseArray<CreateAnswerPayload>(data.answers);

    this.answers = parsedAnswers.map((ans) => {
      const processedAnswer: CreateAnswerPayload = {
        content: String(ans.content || ''),
        isCorrect: String(ans.isCorrect) === 'true' || ans.isCorrect === true,
        imageIndex: ans.imageIndex,
      };

      // Ánh xạ file vật lý vào đáp án dựa trên imageIndex (Map physical file based on index)
      if (
        typeof ans.imageIndex === 'number' &&
        data.answerFiles &&
        data.answerFiles[ans.imageIndex]
      ) {
        processedAnswer.imageFile = data.answerFiles[ans.imageIndex];
      }

      return processedAnswer;
    });
  }

  /**
   * @description Hàm bổ trợ parse mảng an toàn (Helper method for safe array parsing)
   */
  private _parseArray<T>(input: unknown): T[] {
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return input ? [input as unknown as T] : [];
      }
    }
    return Array.isArray(input) ? (input as T[]) : [];
  }

  /**
   * @description Tự xác thực nghiệp vụ (Self-Validation logic)
   */
  public isValid(): void {
    const { QUESTION } = ErrorCode;

    if (!this.chapterId || this.chapterId.length === 0) {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }
    if (!this.content || this.content.trim().length < 10) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }
    if (this.licenseCategoryIds.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }
    if (!Array.isArray(this.answers) || this.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    const hasCorrectAnswer = this.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
  }
}