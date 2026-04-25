import { CreateChapterRequestDTO } from "@/application/dtos/request/chapter/create-chapter.request.dto";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Trình kiểm tra dữ liệu cho Chapter (Dịch: Chapter Validator)
 */
export class CreateChapterValidator {
  public static validate(dto: CreateChapterRequestDTO): void {
    // 1. Kiểm tra tên không được trống
    if (!dto.name || dto.name.trim().length === 0) {
      throw new AppError(ErrorCode.CHAPTER.CREATE_FAILED, 400);
    }

    // 2. Kiểm tra mã chương (Code) không được trống
    if (!dto.code || dto.code.trim().length === 0) {
      // Có thể dùng CREATE_FAILED hoặc định nghĩa thêm INVALID_DATA
      throw new AppError(ErrorCode.CHAPTER.CREATE_FAILED, 400);
    }

    // 3. Kiểm tra thứ tự (Sửa lỗi CHPT_003 trong test của bạn)
    if (typeof dto.orderIndex !== 'number' || dto.orderIndex < 0) {
      throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER, 400); // Mã: CHPT_003
    }
    
    if (dto.description !== undefined) {
      // Nếu gửi chuỗi rỗng hoặc chỉ có khoảng trắng
      if (dto.description.trim().length === 0) {
        // Option A: Coi đây là lỗi nghiệp vụ
        throw new AppError(ErrorCode.CHAPTER.INVALID_DESCRIPTION, 400);
      }
    }
  }
}