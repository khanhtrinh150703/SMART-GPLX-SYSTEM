import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";
import { isUUID } from "@/shared/utils/uuid.util";

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

/**
 * @description DTO xử lý và chuẩn hóa dữ liệu tạo mới câu hỏi.
 */
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
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Kiểm tra định dạng giá trị của isCritical trước khi ép kiểu (Chống giá trị lạ)
    const rawCritical = String(data.isCritical).toLowerCase();
    if (
      rawCritical !== "true" &&
      rawCritical !== "false" &&
      data.isCritical !== true &&
      data.isCritical !== false
    ) {
      throw new AppError(ErrorCode.QUESTION.IS_CRITICAL_INVALID);
    }

    this.chapterId = String(data.chapterId || "");
    this.content = String(data.content || "").trim();
    this.imageFile = data.imageFile;
    this.difficultyLevel =
      data.difficultyLevel !== undefined ? Number(data.difficultyLevel) : NaN;
    this.indexNumber =
      data.indexNumber !== undefined ? Number(data.indexNumber) : NaN;
    this.status = data.status || "ACTIVE";
    this.isCritical = rawCritical === "true" || data.isCritical === true;

    this.licenseCategoryIds = this._parseLicenseCategories(
      data.licenseCategoryIds,
    );

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

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra toàn bộ logic nghiệp vụ dựa trên dữ liệu của instance.
   */
  private validate(): void {
    const { QUESTION } = ErrorCode;

    if (!this.chapterId) {
      throw new AppError(QUESTION.CHAPTER_REQUIRED);
    }

    if (!isUUID(this.chapterId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (this.content.length < 10) {
      throw new AppError(QUESTION.CONTENT_INVALID);
    }

    if (!this.licenseCategoryIds || this.licenseCategoryIds.length === 0) {
      throw new AppError(ErrorCode.QUESTION.LICENSE_REQUIRED);
    }

    for (const id of this.licenseCategoryIds) {
      if (!isUUID(id)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    if (this.answers.length < 2) {
      throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
    }

    const hasCorrect = this.answers.some((ans) => ans.isCorrect === true);
    if (!hasCorrect) {
      throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }

    if (isNaN(this.difficultyLevel) || this.difficultyLevel < 0) {
      throw new AppError(QUESTION.DIFFICULTY_INVALID);
    }

    if (isNaN(this.indexNumber) || this.indexNumber < 0) {
      throw new AppError(QUESTION.INDEX_INVALID);
    }

    const hasEmptyAnswer = this.answers.some((ans) => ans.content.length === 0);
    if (hasEmptyAnswer) {
      throw new AppError(QUESTION.INVALID_FORMAT);
    }

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
