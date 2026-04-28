
import { UpdateChapterRequestDto } from '@/application/dtos/request/chapter/update-chapter.request.dto';
import { AppError, ErrorCode } from '@/shared/errors';

// application/validators/update-chapter.validator.ts

export class UpdateChapterValidator {
    public static validate(dto: UpdateChapterRequestDto): void {
        // 1. Phải có ID mới làm ăn được gì
        // if (!dto.id) {
        //     throw new AppError(ErrorCode.CHAPTER.NOT_FOUND, 404);
        // }

        // 2. Nếu có gửi code, thì code không được để trống
        // CHỈ check định dạng, KHÔNG check trùng ở đây
        if (dto.code !== undefined && dto.code.trim().length === 0) {
            throw new AppError(ErrorCode.CHAPTER.UPDATE_FAILED, 400);
        }

        // 3. Check orderIndex như cũ
        if (dto.orderIndex !== undefined && dto.orderIndex < 0) {
            throw new AppError(ErrorCode.CHAPTER.INVALID_ORDER, 400);
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