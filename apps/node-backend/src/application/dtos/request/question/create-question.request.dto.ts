import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Giao diện dữ liệu đầu vào từ Controller (Xử lý Multipart/FormData).
 */
export interface ICreateQuestionInputDTO {
  readonly indexNumber: string | number;
  readonly chapterId: string;
  readonly content: string;
  readonly licenseCategoryIds: string | string[];
  readonly answers: string | ICreateAnswerPayload[];
  readonly isCritical: string | boolean;
  readonly difficultyLevel: string | number;
  readonly status: QuestionStatus;
  readonly imageFile?: IUploadedFile;
  readonly answerFiles?: IUploadedFile[];
}

/**
 * @description Cấu trúc đáp án sau khi được chuẩn hóa.
 */
export interface ICreateAnswerPayload {
  content: string;
  isCorrect: boolean;
  imageUrl: string;
  imageIndex?: number;
  imageFile?: IUploadedFile;
}

/**
 * @description DTO xử lý tạo câu hỏi mới.
 * Tự động parse dữ liệu từ FormData và ánh xạ hình ảnh vật lý cho từng đáp án.
 */
export class CreateQuestionRequestDTO {
  public readonly indexNumber: number;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: ICreateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: QuestionStatus;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;

  constructor(data: ICreateQuestionInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Ép kiểu và chuẩn hóa dữ liệu cơ bản
    this.chapterId = String(data.chapterId);
    this.content = String(data.content).trim();
    this.imageFile = data.imageFile;
    this.difficultyLevel = Number(data.difficultyLevel);
    this.indexNumber = Number(data.indexNumber);
    this.status = data.status || 'ACTIVE';

    // Xử lý logic Boolean cho câu hỏi điểm liệt (isCritical)
    this.isCritical = String(data.isCritical).toLowerCase() === 'true' || data.isCritical === true;

    // 3. Parse mảng hạng bằng lái (Hỗ trợ JSON string hoặc mảng thô)
    this.licenseCategoryIds = this._parseLicenseCategories(data.licenseCategoryIds);

    // 4. Parse answers và Mapping ảnh vật lý theo Index
    const rawAnswers = this._parseAnswersJson(data.answers);

    this.answers = rawAnswers.map((ans, _idx) => {
      const imgIdx = ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined;

      const processed: ICreateAnswerPayload = {
        content: String(ans.content || '').trim(),
        isCorrect: String(ans.isCorrect).toLowerCase() === 'true' || ans.isCorrect === true,
        imageUrl: '',
        imageIndex: imgIdx,
      };

      // Ánh xạ file vật lý nếu có index tương ứng trong mảng answerFiles
      if (imgIdx !== undefined && data.answerFiles?.[imgIdx]) {
        processed.imageFile = data.answerFiles[imgIdx];
      }

      return processed;
    });
  }

  /**
   * @description Hàm gác cổng kiểm tra tính toàn vẹn của câu hỏi.
   * @private
   */
  private validate(data: ICreateQuestionInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    const { QUESTION } = ErrorCode;

    // 1. Kiểm tra Chương
    if (!data.chapterId || typeof data.chapterId !== 'string') {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }

    // 2. Kiểm tra Nội dung câu hỏi
    if (!data.content || String(data.content).trim().length < 10) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }

    // 3. Kiểm tra định dạng Answers và số lượng
    const parsedAnswers = this._parseAnswersJson(data.answers);
    if (!Array.isArray(parsedAnswers) || parsedAnswers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    // 4. Kiểm tra nội dung từng đáp án và đếm số đáp án đúng
    let correctAnswerCount = 0;
    for (const ans of parsedAnswers) {
      if (!ans.content || String(ans.content).trim().length === 0) {
        throw new AppError(QUESTION.ANSWER_CONTENT_REQUIRED);
      }
      if (ans.isCorrect === true || String(ans.isCorrect).toLowerCase() === 'true') {
        correctAnswerCount++;
      }
    }

    // Đảm bảo có duy nhất 1 đáp án đúng (Theo quy định thi GPLX hiện hành)
    if (correctAnswerCount === 0) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
    if (correctAnswerCount > 1) {
      throw new AppError(QUESTION.MULTIPLE_CORRECT_ANSWERS);
    }

    // 5. Kiểm tra hạng bằng lái
    const categories = this._parseLicenseCategories(data.licenseCategoryIds);
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    if (typeof data.isCritical !== 'boolean') {
      throw new AppError(QUESTION.IS_CRITICAL_INVALID);
    }
    
    // 6. Kiểm tra giải thích (nếu có)
    // if (data.explanation && data.explanation.length > 1000) {
    //   throw new AppError(QUESTION.EXPLANATION_TOO_LONG);
    // }
  }

  private _parseLicenseCategories(input: string | string[]): string[] {
    if (Array.isArray(input)) return input.map(String);
    const trimmed = String(input || '').trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  private _parseAnswersJson(input: string | ICreateAnswerPayload[]): ICreateAnswerPayload[] {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string' && input.trim() !== '') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}