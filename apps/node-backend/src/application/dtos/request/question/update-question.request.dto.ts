import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Cấu trúc đáp án trong yêu cầu cập nhật.
 * Đã bỏ hoàn toàn null, dùng optional hoặc string rỗng.
 */
export interface UpdateAnswerPayload {
  id?: string;             // Có ID: Update/Keep - Không ID: Create new
  content: string;
  isCorrect: boolean;
  imageUrl: string;        // URL ảnh cũ (mặc định là chuỗi rỗng)
  imageIndex?: number;     // Vị trí file trong mảng answerFiles
  imageFile?: IUploadedFile;
}

/**
 * @description Dữ liệu thô từ Controller (Thường từ FormData)
 */
export interface IUpdateQuestionInput {
  id: string;
  chapterId: string;
  content: string;
  licenseCategoryIds: string | string[];
  answers: string | UpdateAnswerPayload[];
  isCritical: string | boolean;
  difficultyLevel: string | number;
  status: QuestionStatus;
  imageFile?: IUploadedFile;
  answerFiles?: IUploadedFile[];
  indexNumber: string | number;
}

export class UpdateQuestionRequestDto {
  public readonly id: string;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: UpdateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: QuestionStatus;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;
  public readonly indexNumber: number;

  constructor(data: IUpdateQuestionInput) {
    // 1. Ép kiểu dữ liệu cơ bản
    this.id = String(data.id || '');
    this.chapterId = String(data.chapterId || '');
    this.content = String(data.content || '');
    this.imageFile = data.imageFile;
    this.difficultyLevel = Number(data.difficultyLevel) || 1;
    this.indexNumber = Number(data.indexNumber) || 1;
    this.status = data.status ?? 'ACTIVE';

    // Xử lý boolean từ string (FormData gửi 'true'/'false')
    this.isCritical = String(data.isCritical).toLowerCase() === 'true';

    // 2. Xử lý mảng licenseCategoryIds (Hỗ trợ cả JSON string hoặc mảng thô)
    this.licenseCategoryIds = this._parseLicenseCategories(data.licenseCategoryIds);

    // 3. Xử lý mảng answers & Ánh xạ file
    const rawAnswers = this._parseAnswersJson(data.answers);

    this.answers = rawAnswers.map((ans) => {
      const processed: UpdateAnswerPayload = {
        id: ans.id,
        content: String(ans.content || '').trim(),
        isCorrect: String(ans.isCorrect) === 'true' || ans.isCorrect === true,
        imageUrl: ans.imageUrl || '', // No null here!
        imageIndex: ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined,
      };

      // Map file vật lý dựa trên imageIndex
      if (
        processed.imageIndex !== undefined &&
        data.answerFiles &&
        data.answerFiles[processed.imageIndex]
      ) {
        processed.imageFile = data.answerFiles[processed.imageIndex];
      }

      return processed;
    });
  }

  /**
     * @private Parse mảng License IDs dựa trên kiểu dữ liệu đã định nghĩa: string | string[]
     */
  private _parseLicenseCategories(input: string | string[]): string[] {
    // 1. Nếu là mảng sẵn rồi (string[]) thì trả về luôn, đỡ phải nghĩ
    if (Array.isArray(input)) {
      return input;
    }

    // 2. Nếu là string, xử lý 2 trường hợp: JSON array hoặc chuỗi phân tách bởi dấu phẩy
    const trimmed = input.trim();
    if (!trimmed) return [];

    try {
      // Thử parse xem có phải dạng '["A1", "A2"]' không
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      // Nếu parse lỗi, chắc chắn là dạng "A1,A2" hoặc chỉ là 1 ID "A1"
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  /**
   * @private Parse JSON an toàn
   */
  private _parseAnswersJson(input: string | UpdateAnswerPayload[]): UpdateAnswerPayload[] {
    // 1. Dùng Type Guard: Nếu là mảng thì dùng luôn
    if (Array.isArray(input)) {
      return input;
    }

    // 2. Nếu là chuỗi thì mới parse
    if (typeof input === 'string' && input.trim() !== '') {
      try {
        const parsed = JSON.parse(input);
        // Kiểm tra lần nữa sau khi parse xem có đúng là mảng không
        return Array.isArray(parsed) ? (parsed as UpdateAnswerPayload[]) : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  /**
   * @description Xác thực DTO trước khi đẩy vào Service
   */
  public isValid(): void {
    const { QUESTION } = ErrorCode;

    if (!this.id) throw new AppError(QUESTION.NOT_FOUND);
    if (!this.chapterId) throw new AppError(QUESTION.CHAPTER_REQUIRED);
    if (this.content.trim().length < 10) throw new AppError(QUESTION.CONTENT_INVALID);
    if (this.licenseCategoryIds.length === 0) throw new AppError(QUESTION.LICENSE_REQUIRED);
    if (this.answers.length < 2) throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);

    const hasCorrect = this.answers.some(a => a.isCorrect);
    if (!hasCorrect) throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
  }
}