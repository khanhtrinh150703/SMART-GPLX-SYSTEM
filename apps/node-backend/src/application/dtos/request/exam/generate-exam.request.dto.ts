import { AppError, ErrorCode } from "@/shared/errors";

export interface IGenerateExamInput {
  matrixId: string;
  userId: string;
  name: string;
}

export class GenerateExamDTO {
  public readonly matrixId: string;
  public readonly userId: string;
  public readonly name: string;

  constructor(data: IGenerateExamInput) {
    this.matrixId = data.matrixId;
    this.userId = data.userId;
    this.name = data.name?.trim(); // Trim luôn cho sạch dữ liệu
  }

  /**
   * @description Tự kiểm tra tính hợp lệ của yêu cầu tạo đề.
   */
  public isValid(): void {
    // 1. Kiểm tra Matrix ID (Luật thi)
    if (!this.matrixId || typeof this.matrixId !== 'string') {
      throw new AppError(ErrorCode.EXAM.INVALID_MATRIX_ID);
    }

    // 2. Kiểm tra User ID (Người tạo/Người thi)
    if (!this.userId || typeof this.userId !== 'string') {
      throw new AppError(ErrorCode.USER.NOT_FOUND); // Hoặc mã lỗi phù hợp
    }

    // 3. Kiểm tra Name (Nếu có truyền lên thì không được để trống hoặc quá dài)
    if (this.name !== undefined) {
      if (this.name.length === 0) {
        throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
      }
      if (this.name.length > 100) {
        throw new AppError(ErrorCode.EXAM.NAME_TOO_LONG);
      }
    }
  }
}