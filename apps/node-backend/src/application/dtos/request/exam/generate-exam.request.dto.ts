import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu khởi tạo đề thi tự động.
 */
export interface IGenerateExamInputDto {
  readonly matrixId: string;
  readonly userId: string;
  readonly name: string;
  readonly status: Status;
}

/**
 * @description DTO xử lý logic tạo đề thi dựa trên ma trận (cấu trúc đề).
 * Đảm bảo các tham số định danh và tên đề thi hợp lệ trước khi vào tầng nghiệp vụ.
 */
export class GenerateExamDTO implements IGenerateExamInputDto {
  public readonly matrixId: string;
  public readonly userId: string;
  public readonly name: string;
  public readonly status: Status;

  constructor(data: IGenerateExamInputDto) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu
    this.matrixId = data.matrixId;
    this.status = data.status;
    this.userId = data.userId;
    this.name = data.name.trim();
  }

  /**
   * @description Hàm gác cổng thực hiện kiểm tra tính hợp lệ đa tầng.
   * @private
   */
  private validate(data: IGenerateExamInputDto): void {
    // Guard Clause: Chống sập hệ thống nếu req.body rỗng
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 1. Kiểm tra Matrix ID (Mã ma trận/Luật thi)
    if (!data.matrixId || typeof data.matrixId !== 'string') {
      throw new AppError(ErrorCode.EXAM.INVALID_MATRIX_ID);
    }

    // 2. Kiểm tra User ID (Người tạo đề)
    if (!data.userId || typeof data.userId !== 'string') {
      throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
    }

    // 3. Kiểm tra tính hợp lệ của Tên đề thi (Name)
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    if (data.name.trim().length > 100) {
      throw new AppError(ErrorCode.EXAM.NAME_TOO_LONG);
    }
  }
}