import { AppError, ErrorCode } from "@/shared/errors";
import { ExamMatrixDetailRequestDTO } from "./exam-matrix-detail.request";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo Ma trận đề thi.
 */
export interface ICreateExamMatrixInputDTO {
  readonly licenseCategoryId: string;
  readonly name: string;
  readonly totalQuestions: number;
  readonly passingScore: number;
  readonly durationMinutes: number;
  readonly minCriticalQuestions: number;
  readonly isDefault: boolean;
  readonly isChapter: boolean;
  readonly details: ExamMatrixDetailRequestDTO[];
}

/**
 * @class CreateExamMatrixRequestDTO
 * @description DTO xử lý tạo mới Ma trận đề thi, thực hiện mapping trước khi validate.
 * @description English: DTO for creating a new Exam Matrix, mapping before validation.
 */
export class CreateExamMatrixRequestDTO implements ICreateExamMatrixInputDTO {
  public readonly licenseCategoryId: string;
  public readonly name: string;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly isDefault: boolean;
  public readonly isChapter: boolean;
  public readonly details: ExamMatrixDetailRequestDTO[];

  /**
   * @param {ICreateExamMatrixInputDTO} data
   * @throws {AppError}
   */
  constructor(data: ICreateExamMatrixInputDTO) {
    // 0. Guard Clause chặn dữ liệu null/undefined
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Mapping & Sanitization (Gán sạch vào this trước)
    this.licenseCategoryId =
      typeof data.licenseCategoryId === "string"
        ? data.licenseCategoryId.trim()
        : "";
    this.name = typeof data.name === "string" ? data.name.trim() : "";
    this.totalQuestions =
      data.totalQuestions !== undefined && data.totalQuestions !== null
        ? Number(data.totalQuestions)
        : NaN;
    this.passingScore =
      data.passingScore !== undefined && data.passingScore !== null
        ? Number(data.passingScore)
        : NaN;
    this.durationMinutes =
      data.durationMinutes !== undefined && data.durationMinutes !== null
        ? Number(data.durationMinutes)
        : NaN;
    this.minCriticalQuestions =
      data.minCriticalQuestions !== undefined &&
      data.minCriticalQuestions !== null
        ? Number(data.minCriticalQuestions)
        : NaN;
    this.isDefault =
      typeof data.isDefault === "boolean" ? data.isDefault : false;
    this.isChapter =
      typeof data.isChapter === "boolean" ? data.isChapter : false;
    this.details = Array.isArray(data.details) ? data.details : [];

    // 2. Validation (Kiểm tra toàn bộ logic ràng buộc bằng thuộc tính của instance)
    this.validate();
  }

  /**
   * @private
   * @description Hàm gác cổng thực hiện kiểm tra logic hoàn toàn dựa trên 'this'.
   * @throws {AppError}
   */
  private validate(): void {
    // 1. Kiểm tra định danh và tên
    if (!this.name) {
      throw new AppError(ErrorCode.MATRIX.NAME_REQUIRED);
    }

    if (this.name.length > 100) {
      throw new AppError(ErrorCode.MATRIX.NAME_TOO_LONG);
    }

    if (!this.licenseCategoryId) {
      throw new AppError(ErrorCode.MATRIX.LICENSE_CATEGORY_REQUIRED);
    }

    if (!isUUID(this.licenseCategoryId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    // 2. Kiểm tra thông số kỹ thuật
    if (this.totalQuestions <= 0 || isNaN(this.totalQuestions)) {
      throw new AppError(ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS);
    }

    if (this.passingScore <= 0 || isNaN(this.passingScore)) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
    }

    if (this.durationMinutes <= 0 || isNaN(this.durationMinutes)) {
      throw new AppError(ErrorCode.MATRIX.INVALID_DURATION);
    }

    if (this.passingScore > this.totalQuestions) {
      throw new AppError(ErrorCode.MATRIX.PASSING_SCORE_TOO_HIGH);
    }

    // 3. Kiểm tra cấu trúc chi tiết (Details)
    if (this.details.length === 0) {
      throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
    }

    // 4. Check trùng lặp chương và tính tổng phần trăm
    const processedChapters = new Set<string>();
    let totalPercent = 0;

    for (const detail of this.details) {
      if (!detail.chapterId || typeof detail.percentage !== "number") {
        throw new AppError(ErrorCode.MATRIX.CHAPTER_ID_REQUIRED);
      }

      if (processedChapters.has(detail.chapterId)) {
        throw new AppError(ErrorCode.MATRIX.DUPLICATE_CHAPTER);
      }
      processedChapters.add(detail.chapterId);

      if (detail.percentage <= 0 || detail.percentage > 100) {
        throw new AppError(ErrorCode.MATRIX.CHAPTER_PERCENTAGE_OUT_OF_RANGE);
      }

      totalPercent += detail.percentage;
    }

    if (totalPercent !== 100) {
      throw new AppError(ErrorCode.MATRIX.TOTAL_PERCENTAGE_NOT_100);
    }

    // 5. Check logic câu điểm liệt (Tách mã lỗi chi tiết)
    if (isNaN(this.minCriticalQuestions)) {
      throw new AppError(ErrorCode.MATRIX.MIN_CRITICAL_REQUIRED);
    }

    if (this.minCriticalQuestions < 0) {
      throw new AppError(ErrorCode.MATRIX.MIN_CRITICAL_NEGATIVE);
    }

    if (this.minCriticalQuestions > this.totalQuestions) {
      throw new AppError(ErrorCode.MATRIX.MIN_CRITICAL_TOO_HIGH);
    }
  }
}
