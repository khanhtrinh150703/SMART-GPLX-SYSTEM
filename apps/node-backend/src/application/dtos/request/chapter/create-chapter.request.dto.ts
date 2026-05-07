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
    // 1. Chặn đứng dữ liệu lỗi/undefined
    this.validate(data);

    // 2. Làm sạch và gán giá trị
    this.name = data.name.trim();
    this.code = data.code.trim();
    this.description = data.description.trim();
    this.orderIndex = data.orderIndex ?? 0;
  }

  /**
   * @description Hàm gác cổng, thực hiện ném AppError dựa trên mã lỗi hệ thống.
   * @private
   */
  private validate(data: ICreateChapterInputDTO): void {
    // Chặn lỗi truy cập thuộc tính của undefined
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Kiểm tra tên và mã chương
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.NAME_REQUIRED);
    }

    if (!data.code || data.code.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.CODE_REQUIRED);
    }

    // Kiểm tra mô tả và độ dài
    if (!data.description || data.description.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.DESCRIPTION_REQUIRED);
    }

    if (data.description.length > 500) {
      throw new AppError(ErrorCode.CHAPTER.DESCRIPTION_TOO_LONG);
    }

    // Kiểm tra tính hợp lệ của thứ tự sắp xếp
    if (typeof data.orderIndex !== 'number' || data.orderIndex < 0) {
      throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER);
    }
  }
}