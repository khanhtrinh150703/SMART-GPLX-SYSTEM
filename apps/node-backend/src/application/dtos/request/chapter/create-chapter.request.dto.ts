import { REGEX } from "@/domain/constants/regex.constant";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo chương lý thuyết.
 */
export interface ICreateChapterInputDTO {
  readonly name: string;
  readonly code: string;
  readonly description: string;
  readonly orderIndex: number;
}

/**
 * @description DTO xử lý tạo mới chương lý thuyết.
 * Đảm bảo tính toàn vẹn của dữ liệu và thứ tự sắp xếp ngay khi khởi tạo.
 */
export class CreateChapterRequestDTO implements ICreateChapterInputDTO {
  public readonly name: string;
  public readonly code: string;
  public readonly description: string;
  public readonly orderIndex: number;

  constructor(data: ICreateChapterInputDTO) {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // --- BƯỚC 1: MAPPING & CHUẨN HÓA (Dọn rác trước) ---
    this.name = typeof data.name === "string" ? data.name.trim() : "";

    this.code =
      typeof data.code === "string" ? data.code.trim().toLowerCase() : "";

    this.description =
      typeof data.description === "string" ? data.description.trim() : "";
    this.orderIndex =
      data.orderIndex !== undefined ? Number(data.orderIndex) : 0;

    // --- BƯỚC 2: TỰ XÁC THỰC (Kiểm tra trên chính mình) ---
    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra dữ liệu đã được làm sạch (this.xxx)
   * @private
   */
  private validate(): void {
    const { CHAPTER } = ErrorCode;

    // Kiểm tra tên (this.name đã được trim)
    if (this.name.length === 0) {
      throw new AppError(CHAPTER.NAME_REQUIRED);
    }

    // Kiểm tra mã chương (this.code đã được trim và lowercase)
    if (this.code.length === 0) {
      throw new AppError(CHAPTER.CODE_REQUIRED);
    }

    if (!REGEX.COMMON.NO_SPACE_SPECIAL_CHAR.test(this.code)) {
      throw new AppError(CHAPTER.INVALID_CODE);
    }

    // Kiểm tra mô tả
    if (this.description.length === 0) {
      throw new AppError(CHAPTER.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(CHAPTER.DESCRIPTION_TOO_LONG);
    }

    // Kiểm tra thứ tự sắp xếp (this.orderIndex đã được ép kiểu Number)
    if (isNaN(this.orderIndex) || this.orderIndex < 0) {
      throw new AppError(CHAPTER.INVALID_ORDER);
    }
  }
}
