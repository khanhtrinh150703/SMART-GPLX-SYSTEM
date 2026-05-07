import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho chi tiết phân bổ chương trong ma trận.
 */
export interface IExamMatrixDetailInputDTO {
  readonly chapterId: string;
  readonly percentage: number;
}

/**
 * @description DTO xử lý logic phân bổ câu hỏi theo từng chương.
 * Đảm bảo tỷ lệ phần trăm (percentage) nằm trong khoảng hợp lệ [0 - 100].
 */
export class ExamMatrixDetailRequestDTO implements IExamMatrixDetailInputDTO {
  public readonly chapterId: string;
  public readonly percentage: number;

  constructor(data: IExamMatrixDetailInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu
    this.chapterId = data.chapterId.trim();
    this.percentage = Number(data.percentage);
  }

  /**
   * @description Hàm gác cổng thực hiện kiểm tra tính hợp lệ của phân bổ.
   * @private
   */
  private validate(data: IExamMatrixDetailInputDTO): void {
    // Chống sập hệ thống nếu data bị undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Kiểm tra ID chương
    if (!data.chapterId || typeof data.chapterId !== 'string') {
      throw new AppError(ErrorCode.MATRIX.CHAPTER_ID_REQUIRED);
    }

    // Kiểm tra tính hợp lệ của tỷ lệ phần trăm
    if (
      data.percentage === undefined ||
      typeof data.percentage !== 'number' ||
      isNaN(data.percentage) ||
      data.percentage < 0 ||
      data.percentage > 100
    ) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
    }
  }
}