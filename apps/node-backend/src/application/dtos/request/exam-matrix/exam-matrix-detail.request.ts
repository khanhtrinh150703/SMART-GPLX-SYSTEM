import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho chi tiết phân bổ chương trong ma trận.
 */
export interface IExamMatrixDetailInputDTO {
  readonly chapterId: string;
  readonly percentage: number;
}

/**
 * @class ExamMatrixDetailRequestDTO
 * @description DTO xử lý logic phân bổ câu hỏi theo từng chương, mapping trước khi validate.
 */
export class ExamMatrixDetailRequestDTO implements IExamMatrixDetailInputDTO {
  public readonly chapterId: string;
  public readonly percentage: number;

  /**
   * @param {IExamMatrixDetailInputDTO} data
   * @throws {AppError}
   */
  constructor(data: IExamMatrixDetailInputDTO) {
    // 0. Guard Clause chặn object null/undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Mapping & Sanitization (Gán và làm sạch dữ liệu)
    this.chapterId =
      typeof data.chapterId === "string" ? data.chapterId.trim() : "";
    this.percentage =
      data.percentage !== undefined && data.percentage !== null
        ? Number(data.percentage)
        : NaN;

    // 2. Validation (Kiểm tra dữ liệu dựa trên instance và data gốc)
    this.validate(data);
  }

  /**
   * @private
   * @description Hàm gác cổng kiểm tra tính hợp lệ của phân bổ chương.
   * @param {IExamMatrixDetailInputDTO} data - Dùng để kiểm tra kiểu dữ liệu nguyên bản.
   * @throws {AppError}
   */
  private validate(data: IExamMatrixDetailInputDTO): void {
    // 1. Kiểm tra ID chương (Dựa trên data gốc để check type)
    if (!data.chapterId || typeof data.chapterId !== "string") {
      throw new AppError(ErrorCode.MATRIX.CHAPTER_ID_REQUIRED);
    }

    // 2. Kiểm tra tính hợp lệ của tỷ lệ phần trăm (Dựa trên giá trị đã mapping)
    if (
      isNaN(this.percentage) ||
      typeof data.percentage !== "number" ||
      this.percentage < 0 ||
      this.percentage > 100
    ) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
    }
  }
}
