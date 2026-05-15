import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixDetailInputDTO } from "./exam-matrix-detail.request";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật ma trận đề thi.
 */
export interface IUpdateExamMatrixInputDto {
  readonly id: string;
  readonly name: string;
  readonly totalQuestions: number;
  readonly passingScore: number;
  readonly durationMinutes: number;
  readonly minCriticalQuestions: number;
  readonly isDefault: boolean;
  readonly isChapter: boolean;
  readonly details: IExamMatrixDetailInputDTO[];
}

/**
 * @class UpdateExamMatrixRequestDTO
 * @description DTO xử lý cập nhật cấu trúc ma trận, thực hiện mapping trước khi validate.
 */
export class UpdateExamMatrixRequestDTO implements IUpdateExamMatrixInputDto {
  public readonly id: string;
  public readonly name: string;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly isDefault: boolean;
  public readonly isChapter: boolean;
  public readonly details: IExamMatrixDetailInputDTO[];

  /**
   * @param {IUpdateExamMatrixInputDto} data
   * @throws {AppError}
   */
  constructor(data: IUpdateExamMatrixInputDto) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Mapping & Sanitization (Gán sạch vào this trước)
    this.id = typeof data.id === "string" ? data.id.trim() : "";
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
   * @description Hàm gác cổng kiểm tra toàn vẹn dữ liệu hoàn toàn dựa trên 'this'.
   * @throws {AppError}
   */
  private validate(): void {
    // 1. Kiểm tra ID và Tên
    if (!this.id) {
      throw new AppError(ErrorCode.MATRIX.ID_REQUIRED);
    }

    if (!isUUID(this.id)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (!this.name) {
      throw new AppError(ErrorCode.MATRIX.NAME_REQUIRED);
    }

    if (this.name.length > 100) {
      throw new AppError(ErrorCode.MATRIX.NAME_TOO_LONG);
    }

    // 2. Kiểm tra các thông số kỹ thuật (Sử dụng giá trị đã mapping)
    if (this.totalQuestions <= 0 || isNaN(this.totalQuestions)) {
      throw new AppError(ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS);
    }

    if (
      this.passingScore <= 0 ||
      isNaN(this.passingScore) ||
      this.passingScore > this.totalQuestions
    ) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
    }

    if (this.durationMinutes <= 0 || isNaN(this.durationMinutes)) {
      throw new AppError(ErrorCode.MATRIX.INVALID_DURATION);
    }

    // 3. Kiểm tra danh sách chi tiết (Details)
    if (this.details.length === 0) {
      throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
    }

    let totalPercent = 0;
    const processedChapters = new Set<string>();

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

    // 4. Check logic câu điểm liệt (Tách mã lỗi chi tiết)
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
