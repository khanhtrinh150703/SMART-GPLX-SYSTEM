import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @interface UpdateAnswerPayload
 * @description Cấu trúc đáp án trong yêu cầu cập nhật.
 */
export interface UpdateAnswerPayload {
  id?: string;            // Có ID là update, không có ID là tạo mới (Dịch: ID exists = update, no ID = new)
  content: string;
  isCorrect: boolean;
  imageUrl?: string | null; // URL ảnh cũ (nếu có)
  imageIndex?: number;    // Index để ánh xạ file mới từ answerFiles
  imageFile?: IUploadedFile; // File vật lý sau khi được DTO ánh xạ
}

/**
 * @interface IUpdateQuestionInput
 * @description Giao diện dữ liệu thô nhận từ Controller cho việc Update.
 */
export interface IUpdateQuestionInput {
  id: string;             // Bắt buộc phải có ID để biết update câu nào
  chapterId: string;
  content: string;
  licenseCategoryIds: string | string[];
  answers: string;        // Chuỗi JSON từ Frontend
  isCritical: string | boolean;
  difficultyLevel: string | number;
  status: QuestionStatus;
  imageFile?: IUploadedFile;       // Ảnh chính mới (nếu muốn đổi)
  answerFiles?: IUploadedFile[];   // Mảng các ảnh mới cho đáp án
}

/**
 * @class UpdateQuestionRequestDto
 * @description DTO vận chuyển dữ liệu cập nhật câu hỏi (Dịch: Question update request DTO).
 */
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

  constructor(data: IUpdateQuestionInput) {
    // 1. Gán và ép kiểu cơ bản (Dịch: Basic casting)
    this.id = String(data.id || '');
    this.chapterId = String(data.chapterId || '');
    this.content = String(data.content || '');
    this.imageFile = data.imageFile;
    this.difficultyLevel = Number(data.difficultyLevel) || 1;
    this.isCritical = String(data.isCritical).toLowerCase() === 'true';
    this.status = data.status ?? 'ACTIVE';

    // 2. Xử lý mảng hạng bằng lái (Dịch: License categories parsing)
    this.licenseCategoryIds = this._parseArray<string>(data.licenseCategoryIds);

    // 3. Xử lý mảng answers & Ánh xạ ảnh mới (Dịch: Answer processing & New Image Mapping)
    const parsedAnswers = this._parseArray<UpdateAnswerPayload>(data.answers);

    this.answers = parsedAnswers.map((ans) => {
      const processedAnswer: UpdateAnswerPayload = {
        id: ans.id, // Giữ lại ID để Repository biết đường mà update thay vì tạo mới
        content: String(ans.content || ''),
        isCorrect: String(ans.isCorrect) === 'true' || ans.isCorrect === true,
        imageUrl: ans.imageUrl, 
        imageIndex: ans.imageIndex,
      };

      // Nếu có imageIndex và có file tương ứng trong answerFiles, thực hiện ánh xạ
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
   * @description Hàm bổ trợ parse mảng an toàn (Dịch: Safe array parsing helper)
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
   * @description Xác thực dữ liệu (Dịch: Data validation)
   */
  public isValid(): void {
    const { QUESTION } = ErrorCode;

    if (!this.id) throw new AppError(QUESTION.NOT_FOUND);
    if (!this.chapterId) throw new AppError(QUESTION.CHAPTER_REQUIRED);
    if (!this.content || this.content.trim().length < 10) throw new AppError(QUESTION.CONTENT_INVALID);
    if (this.licenseCategoryIds.length === 0) throw new AppError(QUESTION.LICENSE_REQUIRED);
    if (this.answers.length < 2) throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);

    const hasCorrectAnswer = this.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
  }
}