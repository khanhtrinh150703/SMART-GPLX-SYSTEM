import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Cấu trúc đáp án trong yêu cầu cập nhật.
 */
export interface IUpdateAnswerPayload {
  readonly id?: string;
  readonly content: string;
  readonly isCorrect: boolean;
  readonly imageUrl: string;
  readonly imageIndex?: number;
  readonly imageFile?: IUploadedFile;
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

    this.id = String(data.id || "").trim();
    this.chapterId = String(data.chapterId || "").trim();
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

    // Parse và Mapping đáp án
    const rawAnswers = this._parseAnswersJson(data.answers);
    this.answers = rawAnswers.map((ans) => {
      const imgIdx =
        ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined;
      const isCorrect =
        String(ans.isCorrect).toLowerCase() === "true" ||
        ans.isCorrect === true;

      // Gán thẳng vào đây để không bị lỗi readonly
      const processed: IUpdateAnswerPayload = {
        id: ans.id?.trim(),
        content: String(ans.content || "").trim(),
        isCorrect,
        imageUrl: ans.imageUrl || "",
        imageIndex: imgIdx,
        imageFile:
          imgIdx !== undefined && data.answerFiles?.[imgIdx]
            ? data.answerFiles[imgIdx]
            : undefined,
      };

      return processed;
    });

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra toàn bộ logic nghiệp vụ câu hỏi dựa trên dữ liệu của instance.
   */
  private validate(): void {
    const { QUESTION } = ErrorCode;

    if (!this.id) {
      throw new AppError(QUESTION.ID_REQUIRED);
    }

    if (!isUUID(this.id)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

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

    for (const ans of this.answers) {
      if (ans.content.length === 0) {
        throw new AppError(QUESTION.INVALID_FORMAT);
      }
      if (ans.id && !isUUID(ans.id)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
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
