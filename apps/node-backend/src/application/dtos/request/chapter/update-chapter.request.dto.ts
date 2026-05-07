import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật chương lý thuyết.
 */
export interface IUpdateChapterInputDTO {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description: string;
  readonly orderIndex: number;
}

/**
 * @description DTO xử lý cập nhật thông tin chương lý thuyết.
 * Đảm bảo ID và các trường thông tin bắt buộc phải hợp lệ trước khi thực hiện update.
 */
export class UpdateChapterRequestDTO implements IUpdateChapterInputDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly description: string;
  public readonly orderIndex: number;

  constructor(data: IUpdateChapterInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay từ vòng gửi xe
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu (Sanitization)
    this.id = data.id;
    this.name = data.name.trim();
    this.code = data.code.trim();
    this.description = data.description.trim();
    this.orderIndex = data.orderIndex ?? 0;
  }

  /**
   * @description Hàm bảo vệ thực hiện ném AppError chỉ với mã lỗi.
   * @private
   */
  private validate(data: IUpdateChapterInputDTO): void {
    // Chống sập hệ thống nếu req.body rỗng
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Kiểm tra ID (Trường quan trọng nhất để xác định bản ghi)
    if (!data.id) {
      throw new AppError(ErrorCode.CHAPTER.ID_REQUIRED);
    }

    // Kiểm tra các trường nội dung bắt buộc
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.NAME_REQUIRED);
    }

    if (!data.code || data.code.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.CODE_REQUIRED);
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.DESCRIPTION_REQUIRED);
    }

    // Kiểm tra giới hạn độ dài và logic nghiệp vụ
    if (data.description.length > 500) {
      throw new AppError(ErrorCode.CHAPTER.DESCRIPTION_TOO_LONG);
    }

    if (typeof data.orderIndex !== 'number' || data.orderIndex < 0) {
      throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER);
    }
  }
}