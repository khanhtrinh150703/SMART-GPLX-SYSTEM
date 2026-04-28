import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description DTO dùng để tạo mới một chương lý thuyết (Data Transfer Object for Chapter Creation).
 */
export class CreateChapterRequestDto {
  /** @property {string} name - Tên chương (Ví dụ: Khái niệm và quy tắc giao thông). */
  public readonly name: string;

  /** @property {string} description - Mô tả nội dung chương (Mặc định: chuỗi rỗng). */
  public readonly description: string;

  /** @property {number} orderIndex - Thứ tự sắp xếp của chương (Mặc định: 0). */
  public readonly orderIndex: number;

  /** @property {string} code - Mã nhận diện chương (Ví dụ: CH-01). */
  public readonly code: string;

  /**
   * @description Hàm khởi tạo với cơ chế gán giá trị mặc định.
   * @param {Partial<CreateChapterRequestDto>} data - Dữ liệu thô từ Request.
   */
  constructor(data: Partial<CreateChapterRequestDto>) {
    this.name = data.name?.trim() ?? '';
    this.description = data.description?.trim() ?? '';
    this.orderIndex = data.orderIndex ?? 0;
    this.code = data.code?.trim() ?? '';
  }

  /**
   * @description Kiểm tra tính hợp lệ của dữ liệu (Manual Validation).
   * @returns {{ isValid: boolean; errors: string[] }} Kết quả xác thực.
   */
  public isValid(): void {

    if (!this.name) throw new AppError(ErrorCode.VALIDATION.NAME_REQUIRED);
    if (!this.code) throw new AppError(ErrorCode.VALIDATION.CODE_REQUIRED);
    if (this.orderIndex < 0) throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER);
    if (!this.description) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_REQUIRED);
    }

    if (this.description.length > 500) {
      throw new AppError(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
    }
  }
}