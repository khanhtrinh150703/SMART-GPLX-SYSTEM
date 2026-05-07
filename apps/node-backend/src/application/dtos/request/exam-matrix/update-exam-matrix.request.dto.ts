import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixDetailInputDTO } from "./exam-matrix-detail.request";

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
  readonly details: IExamMatrixDetailInputDTO[];
}

/**
 * @description DTO xử lý cập nhật cấu trúc ma trận đề thi.
 * Đảm bảo tổng tỷ lệ phân bổ chương luôn đạt 100% và các ràng buộc về điểm số.
 */
export class UpdateExamMatrixRequestDTO implements IUpdateExamMatrixInputDto {
  public readonly id: string;
  public readonly name: string;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly isDefault: boolean;
  public readonly details: IExamMatrixDetailInputDTO[];

  constructor(data: IUpdateExamMatrixInputDto) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa
    this.id = data.id;
    this.name = data.name.trim();
    this.totalQuestions = Number(data.totalQuestions);
    this.passingScore = Number(data.passingScore);
    this.durationMinutes = Number(data.durationMinutes);
    this.minCriticalQuestions = Number(data.minCriticalQuestions);
    this.isDefault = Boolean(data.isDefault);
    this.details = data.details;
  }

  /**
   * @description Hàm gác cổng kiểm tra toàn vẹn dữ liệu và logic nghiệp vụ ma trận.
   * @private
   */
  private validate(data: IUpdateExamMatrixInputDto): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // 1. Kiểm tra các trường định danh và cơ bản
    if (!data.id || data.id.trim() === '') {
      throw new AppError(ErrorCode.MATRIX.ID_REQUIRED);
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new AppError(ErrorCode.MATRIX.NAME_REQUIRED);
    }

    if (data.name.length > 100) {
      throw new AppError(ErrorCode.MATRIX.NAME_TOO_LONG);
    }

    // 2. Kiểm tra các thông số kỹ thuật của đề thi
    if (data.totalQuestions <= 0) {
      throw new AppError(ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS);
    }

    if (data.passingScore <= 0 || data.passingScore > data.totalQuestions) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
    }

    if (data.durationMinutes <= 0) {
      throw new AppError(ErrorCode.MATRIX.INVALID_DURATION);
    }

    if (typeof data.minCriticalQuestions !== 'number' || data.minCriticalQuestions < 0) {
      throw new AppError(ErrorCode.MATRIX.MIN_CRITICAL_INVALID);
    }

    // 3. Kiểm tra danh sách chi tiết phân bổ chương (Details)
    if (!Array.isArray(data.details) || data.details.length === 0) {
      throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
    }

    let totalPercent = 0;
    for (const detail of data.details) {
      if (!detail.chapterId || typeof detail.percentage !== 'number') {
        throw new AppError(ErrorCode.MATRIX.CHAPTER_ID_REQUIRED);
      }

      if (detail.percentage <= 0 || detail.percentage > 100) {
        throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
      }

      totalPercent += detail.percentage;
    }

    if (totalPercent !== 100) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
    }

    // 4. Kiểm tra kiểu boolean cho isDefault
    if (typeof data.isDefault !== 'boolean') {
      throw new AppError(ErrorCode.MATRIX.IS_DEFAULT_INVALID);
    }
  }
}