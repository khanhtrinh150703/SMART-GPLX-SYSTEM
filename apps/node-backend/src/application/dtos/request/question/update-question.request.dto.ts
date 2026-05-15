import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Cấu trúc đáp án trong yêu cầu cập nhật.
 */
export interface IUpdateAnswerPayload {
  id?: string;
  content: string;
  isCorrect: boolean;
  imageUrl: string;
  imageIndex?: number;
  imageFile?: IUploadedFile;
}

/**
 * @description Dữ liệu thô từ Controller (Thường từ FormData/Multipart).
 */
export interface IUpdateQuestionInputDTO {
  readonly id: string;
  readonly chapterId: string;
  readonly content: string;
  readonly licenseCategoryIds: string | string[];
  readonly answers: string | IUpdateAnswerPayload[];
  readonly isCritical: string | boolean;
  readonly status: Status;
  readonly difficultyLevel: string | number;
  readonly imageFile?: IUploadedFile;
  readonly answerFiles?: IUploadedFile[];
  readonly indexNumber: string | number;
}

/**
 * @description DTO xử lý cập nhật câu hỏi. Tự động chuẩn hóa và ánh xạ hình ảnh vật lý.
 */
export class UpdateQuestionRequestDTO implements IUpdateQuestionInputDTO {
  public readonly id: string;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: IUpdateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: Status;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;
  public readonly indexNumber: number;

  constructor(data: IUpdateQuestionInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // --- 1. MAPPING & CHUẨN HÓA (Dọn rác trước) ---
    this.id = String(data.id || "");
    this.chapterId = String(data.chapterId || "");
    this.content = String(data.content || "").trim();
    this.imageFile = data.imageFile;
    this.difficultyLevel =
      data.difficultyLevel !== undefined ? Number(data.difficultyLevel) : NaN;
    this.indexNumber =
      data.indexNumber !== undefined ? Number(data.indexNumber) : NaN;
    this.status = data.status || "ACTIVE";

    // Chuẩn hóa logic Boolean
    this.isCritical =
      String(data.isCritical).toLowerCase() === "true" ||
      data.isCritical === true;

    // Parse mảng hạng bằng
    this.licenseCategoryIds = this._parseLicenseCategories(
      data.licenseCategoryIds,
    );

    // Parse và Mapping đáp án (Xử lý ID, Content, Boolean và File vật lý)
    const rawAnswers = this._parseAnswersJson(data.answers);
    this.answers = rawAnswers.map((ans) => {
      const imgIdx =
        ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined;
      const isCorrect =
        String(ans.isCorrect).toLowerCase() === "true" ||
        ans.isCorrect === true;

      const processed: IUpdateAnswerPayload = {
        id: ans.id, // Giữ ID để biết là Update hay Create mới
        content: String(ans.content || "").trim(),
        isCorrect,
        imageUrl: ans.imageUrl || "",
        imageIndex: imgIdx,
      };

      if (imgIdx !== undefined && data.answerFiles?.[imgIdx]) {
        processed.imageFile = data.answerFiles[imgIdx];
      }
      return processed;
    });

    // --- 2. VALIDATE CHÍNH NÓ (Check 10+ điều kiện trên dữ liệu đã sạch) ---
    this.validate(data.isCritical);
  }

  /**
   * @description Hàm gác cổng kiểm tra toàn bộ logic nghiệp vụ câu hỏi.
   * @private
   */
  private validate(rawIsCritical: string | boolean): void {
    const { QUESTION } = ErrorCode;

    // 1. Kiểm tra ID câu hỏi (Bắt buộc cho Update)
    if (!this.id) throw new AppError(QUESTION.ID_REQUIRED);

    // 2. Kiểm tra Chapter
    if (!this.chapterId) throw new AppError(QUESTION.CHAPTER_REQUIRED);

    // 3. Kiểm tra nội dung câu hỏi
    if (this.content.length < 10) throw new AppError(QUESTION.CONTENT_INVALID);

    // 4. Kiểm tra Hạng bằng lái (Đã là mảng sạch nhờ _parse)
    if (this.licenseCategoryIds.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    // 5. Kiểm tra số lượng đáp án
    if (this.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    // 6. Kiểm tra đáp án đúng
    const hasCorrect = this.answers.some((ans) => ans.isCorrect === true);
    if (!hasCorrect) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }

    // 7. Kiểm tra độ khó
    if (isNaN(this.difficultyLevel) || this.difficultyLevel < 0) {
      throw new AppError(QUESTION.DIFFICULTY_INVALID);
    }

    // 8. Kiểm tra số thứ tự
    if (isNaN(this.indexNumber) || this.indexNumber < 0) {
      throw new AppError(QUESTION.INDEX_INVALID);
    }

    // 9. Kiểm tra định dạng Boolean cho isCritical
    const isTrue = rawIsCritical === true || rawIsCritical === "true";
    const isFalse = rawIsCritical === false || rawIsCritical === "false";
    if (!isTrue && !isFalse) {
      throw new AppError(QUESTION.IS_CRITICAL_INVALID);
    }

    // 10. Kiểm tra nội dung từng đáp án
    const hasEmptyAnswer = this.answers.some((ans) => ans.content.length === 0);
    if (hasEmptyAnswer) {
      throw new AppError(QUESTION.INVALID_FORMAT);
    }
  }

  /**
   * @description Parse an toàn danh sách hạng bằng lái.
   * @private
   */
  private _parseLicenseCategories(input: string | string[]): string[] {
    if (Array.isArray(input)) return input.map(String);
    const trimmed = String(input || "").trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      return trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  /**
   * @description Parse JSON mảng đáp án từ chuỗi FormData.
   * @private
   */
  private _parseAnswersJson(
    input: string | IUpdateAnswerPayload[],
  ): IUpdateAnswerPayload[] {
    if (Array.isArray(input)) return input;
    if (typeof input === "string" && input.trim() !== "") {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        throw new AppError(ErrorCode.QUESTION.INVALID_FORMAT);
      }
    }
    return [];
  }
}
