import { REGEX } from "@/domain/constants/regex.constant";
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
 */
export class UpdateChapterRequestDTO implements IUpdateChapterInputDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly description: string;
  public readonly orderIndex: number;

  constructor(data: IUpdateChapterInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // --- BƯỚC 1: MAPPING & CHUẨN HÓA (Sanitization) ---
    this.id = data.id; // ID thường là UUID nên không cần trim/lowercase
    // Mapping & Sanitization trực tiếp, cực kỳ chuyên nghiệp
    this.name = typeof data.name === "string" ? data.name.trim() : "";

    this.code =
      typeof data.code === "string" ? data.code.trim().toLowerCase() : "";

    this.description =
      typeof data.description === "string" ? data.description.trim() : "";

    // Ép kiểu số an toàn đề phòng dữ liệu từ multipart hoặc query string
    this.orderIndex =
      data.orderIndex !== undefined ? Number(data.orderIndex) : 0;

    // --- BƯỚC 2: TỰ XÁC THỰC (Validate Self) ---
    this.validate();
  }

  /**
   * @description Hàm bảo vệ kiểm tra tính toàn vẹn dựa trên thuộc tính nội bộ.
   * @private
   */
  private validate(): void {
    const { CHAPTER } = ErrorCode;

    // 1. Kiểm tra ID (Bắt buộc phải có để xác định bản ghi cần update)
    if (!this.id) {
      throw new AppError(CHAPTER.ID_REQUIRED);
    }

    // 2. Kiểm tra Name (Sử dụng this.name đã được trim)
    if (this.name.length === 0) {
      throw new AppError(CHAPTER.NAME_REQUIRED);
    }

    // 3. Kiểm tra Code
    if (this.code.length === 0) {
      throw new AppError(CHAPTER.CODE_REQUIRED);
    }

    if (!REGEX.COMMON.NO_SPACE_SPECIAL_CHAR.test(this.code)) {
      throw new AppError(CHAPTER.INVALID_CODE);
    }

    // 4. Kiểm tra Description
    if (this.description.length === 0) {
      throw new AppError(CHAPTER.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(CHAPTER.DESCRIPTION_TOO_LONG);
    }

    // 5. Kiểm tra OrderIndex (Đã được ép kiểu Number)
    if (isNaN(this.orderIndex) || this.orderIndex < 0) {
      throw new AppError(CHAPTER.INVALID_ORDER);
    }
  }
}
