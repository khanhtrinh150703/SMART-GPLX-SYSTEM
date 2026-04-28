import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Cấu trúc đáp án sau khi được DTO xử lý.
 * Khớp hoàn toàn với đầu vào của Question.create.
 */
export interface CreateAnswerPayload {
  content: string;
  isCorrect: boolean;
  imageUrl: string;
  imageIndex?: number;
  imageFile?: IUploadedFile;
}

/**
 * @description Dữ liệu thô từ Controller (Multipart/FormData)
 */
export interface ICreateQuestionInput {
  indexNumber: string | number;
  chapterId: string;
  content: string;
  licenseCategoryIds: string | string[];
  answers: string | CreateAnswerPayload[];
  isCritical: string | boolean;
  difficultyLevel: string | number;
  status: QuestionStatus;
  imageFile?: IUploadedFile;
  answerFiles?: IUploadedFile[];
}

export class CreateQuestionRequestDto {
  public readonly indexNumber: number;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: CreateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: QuestionStatus;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;

  constructor(data: ICreateQuestionInput) {
    // 1. Ép kiểu cơ bản (Casting)
    this.chapterId = String(data.chapterId || '');
    this.content = String(data.content || '');
    this.imageFile = data.imageFile;
    this.difficultyLevel = Number(data.difficultyLevel) || 1;
    this.indexNumber = Number(data.indexNumber) || 1;
    this.status = data.status ?? 'ACTIVE';

    // Xử lý boolean từ FormData (string 'true' -> boolean true)
    this.isCritical = String(data.isCritical).toLowerCase() === 'true';

    // 2. Parse mảng hạng bằng lái (Dựa trên string | string[])
    this.licenseCategoryIds = this._parseLicenseCategories(data.licenseCategoryIds);

    // 3. Parse answers và Ánh xạ ảnh vật lý
    const rawAnswers = this._parseAnswersJson(data.answers);

    this.answers = rawAnswers.map((ans, idx) => {
      // 1. Nếu ans bị null/undefined, chửi ngay lập tức!
      if (!ans) {
        throw new AppError(ErrorCode.QUESTION.NOT_FOUND, `Dữ liệu đáp án tại vị trí ${idx} không hợp lệ`);
      }

      // 2. Ép kiểu index
      const imgIdx = ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined;

      // 3. Mapping dữ liệu (Đảm bảo ans.content và ans.isCorrect tồn tại trong JSON)
      const processed: CreateAnswerPayload = {
        content: String(ans.content || '').trim(),
        isCorrect: String(ans.isCorrect) === 'true' || ans.isCorrect === true,
        imageUrl: '',
        imageIndex: imgIdx,
      };

      // 4. Xử lý file vật lý
      if (imgIdx !== undefined && data.answerFiles?.[imgIdx]) {
        processed.imageFile = data.answerFiles[imgIdx];
      }

      return processed; // Lúc này TS sẽ hiểu kết quả chắc chắn KHÔNG PHẢI null
    });
  }

  /**
   * @private Xử lý parse License Categories (string | string[])
   */
  private _parseLicenseCategories(input: string | string[]): string[] {
    if (Array.isArray(input)) return input.map(String);

    const trimmed = input.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      // Xử lý trường hợp chuỗi "A1,A2"
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  /**
   * @private Parse JSON answers an toàn
   */
  private _parseAnswersJson(input: string | CreateAnswerPayload[]): CreateAnswerPayload[] {
    // 1. Dùng Type Guard: Nếu là mảng thì dùng luôn
    if (Array.isArray(input)) {
      return input;
    }

    // 2. Nếu là chuỗi thì mới parse
    if (typeof input === 'string' && input.trim() !== '') {
      try {
        const parsed = JSON.parse(input);
        // Kiểm tra lần nữa sau khi parse xem có đúng là mảng không
        return Array.isArray(parsed) ? (parsed as CreateAnswerPayload[]) : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  /**
   * @description Xác thực nghiệp vụ DTO
   */
  public isValid(): void {
    const { QUESTION } = ErrorCode;

    if (!this.chapterId) throw new AppError(QUESTION.CHAPTER_REQUIRED);
    if (this.content.trim().length < 10) throw new AppError(QUESTION.CONTENT_INVALID);
    if (this.licenseCategoryIds.length === 0) throw new AppError(QUESTION.LICENSE_REQUIRED);
    if (this.answers.length < 2) throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);

    const hasCorrect = this.answers.some((a) => a.isCorrect);
    if (!hasCorrect) throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
  }
}