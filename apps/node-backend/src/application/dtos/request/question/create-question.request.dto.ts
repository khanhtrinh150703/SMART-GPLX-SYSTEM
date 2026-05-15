import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Giao diện dữ liệu thô từ Controller (Xử lý Multipart/FormData).
 */
export interface ICreateQuestionInputDTO {
  readonly indexNumber: string | number;
  readonly chapterId: string;
  readonly content: string;
  readonly licenseCategoryIds: string | string[];
  readonly answers: string | ICreateAnswerPayload[];
  readonly isCritical: string | boolean;
  readonly difficultyLevel: string | number;
  readonly status: Status;
  readonly imageFile?: IUploadedFile;
  readonly answerFiles?: IUploadedFile[];
}

export interface ICreateAnswerPayload {
  content: string;
  isCorrect: boolean;
  imageUrl: string;
  imageIndex?: number;
  imageFile?: IUploadedFile;
}

export class CreateQuestionRequestDTO {
  public readonly indexNumber: number;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly licenseCategoryIds: string[];
  public readonly answers: ICreateAnswerPayload[];
  public readonly isCritical: boolean;
  public readonly status: Status;
  public readonly difficultyLevel: number;
  public readonly imageFile?: IUploadedFile;

  constructor(data: ICreateQuestionInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // --- 1. MAPPING & CHUẨN HÓA (Normalize First) ---
    this.chapterId = String(data.chapterId || "");
    this.content = String(data.content || "").trim();
    this.imageFile = data.imageFile;
    this.difficultyLevel =
      data.difficultyLevel !== undefined ? Number(data.difficultyLevel) : NaN;
    this.indexNumber =
      data.indexNumber !== undefined ? Number(data.indexNumber) : NaN;
    this.status = data.status || "ACTIVE";

    // Chuẩn hóa logic Boolean cho isCritical
    const rawCritical = String(data.isCritical).toLowerCase();
    this.isCritical = rawCritical === "true" || data.isCritical === true;

    // Parse mảng hạng bằng lái
    this.licenseCategoryIds = this._parseLicenseCategories(
      data.licenseCategoryIds,
    );

    // Parse và Mapping đáp án
    const rawAnswers = this._parseAnswersJson(data.answers);
    this.answers = rawAnswers.map((ans) => {
      const imgIdx =
        ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined;
      const isCorrect =
        String(ans.isCorrect).toLowerCase() === "true" ||
        ans.isCorrect === true;

      const processed: ICreateAnswerPayload = {
        content: String(ans.content || "").trim(),
        isCorrect,
        imageUrl: "",
        imageIndex: imgIdx,
      };

      if (imgIdx !== undefined && data.answerFiles?.[imgIdx]) {
        processed.imageFile = data.answerFiles[imgIdx];
      }
      return processed;
    });

    // --- 2. VALIDATE CHÍNH NÓ (Dùng 'this' để check dữ liệu đã sạch) ---
    this.validate(data.isCritical); // Truyền raw isCritical để check định dạng ở bước cuối
  }

  /**
   * @description Kiểm tra toàn bộ 10+ điều kiện logic nghiệp vụ.
   */
  private validate(rawIsCritical: string | boolean): void {
    const { QUESTION } = ErrorCode;

    // 1. Kiểm tra Chapter
    if (!this.chapterId) throw new AppError(QUESTION.CHAPTER_REQUIRED);

    // 2. Kiểm tra nội dung (Độ dài tối thiểu 10)
    if (this.content.length < 10) throw new AppError(QUESTION.CONTENT_INVALID);

    // 3. Kiểm tra Hạng bằng lái (Đảm bảo mảng không rỗng)
    if (this.licenseCategoryIds.length === 0) {
      throw new AppError(QUESTION.LICENSE_REQUIRED);
    }

    // 4. Kiểm tra số lượng đáp án (Tối thiểu 2)
    if (this.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    // 5. Kiểm tra sự tồn tại của đáp án đúng
    const hasCorrect = this.answers.some((ans) => ans.isCorrect === true);
    if (!hasCorrect) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }

    // 6. Kiểm tra độ khó (Phải là số dương)
    if (isNaN(this.difficultyLevel) || this.difficultyLevel < 0) {
      throw new AppError(QUESTION.DIFFICULTY_INVALID);
    }

    // 7. Kiểm tra số thứ tự câu hỏi (Phải là số dương)
    if (isNaN(this.indexNumber) || this.indexNumber < 0) {
      throw new AppError(QUESTION.INDEX_INVALID);
    }

    // 8. Kiểm tra định dạng Boolean cho isCritical (Chống giá trị lạ)
    const isTrue = rawIsCritical === true || rawIsCritical === "true";
    const isFalse = rawIsCritical === false || rawIsCritical === "false";
    if (!isTrue && !isFalse) {
      throw new AppError(QUESTION.IS_CRITICAL_INVALID);
    }

    // 9. Kiểm tra tính hợp lệ của từng đáp án (Nội dung không được để trống)
    const hasEmptyAnswer = this.answers.some((ans) => ans.content.length === 0);
    if (hasEmptyAnswer) {
      throw new AppError(QUESTION.INVALID_FORMAT);
    }

    // 10. Check logic bổ sung (Ví dụ: Trạng thái)
    if (!this.status) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }
  }

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

  private _parseAnswersJson(
    input: string | ICreateAnswerPayload[],
  ): ICreateAnswerPayload[] {
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
