import { Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Giao diện dữ liệu đầu vào khởi tạo đề thi tự động.
 */
export interface IGenerateExamInputDto {
  readonly matrixId: string;
  readonly userId: string;
  readonly name: string;
  readonly status: Status;
}

/**
 * @description DTO xử lý và chuẩn hóa dữ liệu tạo đề thi từ ma trận.
 */
export class GenerateExamDTO implements IGenerateExamInputDto {
  public readonly matrixId: string;
  public readonly userId: string;
  public readonly name: string;
  public readonly status: Status;

  constructor(data: IGenerateExamInputDto) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    this.matrixId = data.matrixId;
    this.status = data.status;
    this.userId = data.userId;
    this.name = data.name?.trim() || "";

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ đa tầng.
   */
  private validate(): void {
    if (!this.matrixId || typeof this.matrixId !== "string") {
      throw new AppError(ErrorCode.EXAM.INVALID_MATRIX_ID);
    }

    if (!isUUID(this.matrixId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (!this.userId || typeof this.userId !== "string") {
      throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
    }

    if (!isUUID(this.userId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (!this.name || this.name.length === 0) {
      throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
    }

    if (this.name.length > 100) {
      throw new AppError(ErrorCode.EXAM.NAME_TOO_LONG);
    }
  }
}
