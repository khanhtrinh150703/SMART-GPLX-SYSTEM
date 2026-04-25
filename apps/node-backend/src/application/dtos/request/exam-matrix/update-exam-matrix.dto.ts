import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixDetailRequest } from "./exam-matrix-detail.request";

/**
 * @description DTO dùng cho yêu cầu cập nhật Ma trận đề thi.
 * Lưu ý: licenseCategoryId thường không được thay đổi để đảm bảo tính nhất quán của hạng bằng.
 */
export class UpdateExamMatrixDTO {
    public readonly totalQuestions: number;
    public readonly passingScore: number;
    public readonly durationMinutes: number;
    public readonly minCriticalQuestions: number;
    public readonly details: IExamMatrixDetailRequest[];
    public readonly name: string;
    public readonly isDefault: boolean;

    constructor(data: UpdateExamMatrixDTO) {
        this.totalQuestions = data.totalQuestions;
        this.passingScore = data.passingScore;
        this.durationMinutes = data.durationMinutes;
        this.minCriticalQuestions = data.minCriticalQuestions;
        this.details = data.details;
        this.name = data.name;
        this.isDefault = data.isDefault;
    }
    /**
       * @description Kiểm tra tính toàn vẹn và logic của Ma trận đề thi.
       * @throws {AppError} Ném lỗi nếu dữ liệu vi phạm quy tắc nghiệp vụ.
       */
    public isValid(): void {
        // 1. Kiểm tra các thông số cơ bản (Phải lớn hơn 0)
        const mandatoryFields = [
            { value: this.totalQuestions, name: 'totalQuestions' },
            { value: this.passingScore, name: 'passingScore' },
            { value: this.durationMinutes, name: 'durationMinutes' },
            { value: this.minCriticalQuestions, name: 'minCriticalQuestions' },
            { value: this.name, name: 'name' }
        ];

        for (const field of mandatoryFields) {
            // Kiểm tra null hoặc undefined (0 vẫn được chấp nhận nếu logic cho phép, 
            // nhưng ở đây totalQuestions > 0 nên ta check kỹ hơn)
            if (field.value === undefined || field.value === null) {
                throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
                // Hoặc bạn có thể ném lỗi chi tiết hơn nếu muốn
            }
        }

        if (!this.name) {
            throw new AppError(ErrorCode.MATRIX.NAME_REQUIRED)
        }

        if (this.name.length > 100) {
            throw new AppError(ErrorCode.MATRIX.NAME_TOO_LONG)
        }

        if (this.totalQuestions <= 0 || this.passingScore <= 0 || this.durationMinutes <= 0) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // 2. Logic nghiệp vụ: Điểm sàn không được phép lớn hơn tổng số câu hỏi
        if (this.passingScore > this.totalQuestions) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
        }

        // 3. Kiểm tra danh sách chi tiết (details)
        if (!Array.isArray(this.details) || this.details.length === 0) {
            throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
        }

        // 4. Kiểm tra từng phần tử và tính tổng phần trăm
        let totalPercent = 0;

        this.details.forEach((detail) => {
            // Kiểm tra kiểu dữ liệu (chapterId là string theo Schema Prisma của bạn)
            if (typeof detail.chapterId !== "string" || typeof detail.percentage !== "number") {
                throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
            }

            // Từng phần trăm lẻ phải nằm trong khoảng (0, 100)
            if (detail.percentage <= 0 || detail.percentage > 100) {
                throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
            }

            totalPercent += detail.percentage;
        });

        // 5. Ràng buộc quan trọng: Tổng phần trăm tất cả các chương phải bằng 100%
        if (totalPercent !== 100) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
        }
    }
}