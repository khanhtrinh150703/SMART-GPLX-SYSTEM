import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixDetailRequest } from "./exam-matrix-detail.request";

/**
 * @description DTO dùng cho yêu cầu tạo mới Ma trận đề thi.
 * Tự chịu trách nhiệm kiểm tra tính hợp lệ về kiểu dữ liệu (Input Validation).
 */
export class CreateExamMatrixDTO {
    public readonly licenseCategoryId: string;
    public readonly name: string;
    public readonly totalQuestions: number;
    public readonly passingScore: number;
    public readonly durationMinutes: number;
    public readonly minCriticalQuestions: number;
    public readonly isDefault: boolean;
    public readonly details: IExamMatrixDetailRequest[];

    constructor(data: CreateExamMatrixDTO) {
        this.name = data.name;
        this.licenseCategoryId = data.licenseCategoryId;
        this.totalQuestions = data.totalQuestions;
        this.passingScore = data.passingScore;
        this.durationMinutes = data.durationMinutes;
        this.minCriticalQuestions = data.minCriticalQuestions;
        this.details = data.details;
        this.isDefault = data.isDefault;
    }

    /**
     * @description Kiểm tra tính hợp lệ của dữ liệu đầu vào trước khi vào tầng Service.
     * Đảm bảo các ràng buộc về kiểu dữ liệu và logic cơ bản của Ma trận.
     * @throws {AppError} Ném lỗi nếu dữ liệu không đúng định dạng hoặc vi phạm quy tắc ma trận.
     */
    public isValid(): void {
        // 1. Kiểm tra các thông tin cơ bản
        
        const mandatoryFields = [
            { value: this.licenseCategoryId, name: 'licenseCategoryId' },
            { value: this.totalQuestions, name: 'totalQuestions' },
            { value: this.passingScore, name: 'passingScore' },
            { value: this.durationMinutes, name: 'durationMinutes' },
            { value: this.minCriticalQuestions, name: 'minCriticalQuestions' },
            { value: this.name, name: 'name' },
            { value: this.isDefault, name: 'isDefault' },
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
        
        if (!this.licenseCategoryId) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED); // Hoặc mã lỗi chung cho Input
        }

        if (this.totalQuestions <= 0 || this.passingScore <= 0 || this.durationMinutes <= 0) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // Kiểm tra logic: Điểm đạt không được lớn hơn tổng số câu
        if (this.passingScore > this.totalQuestions) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
        }

        // 2. Kiểm tra danh sách chi tiết (details)
        if (!Array.isArray(this.details) || this.details.length === 0) {
            throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
        }

        let totalPercent = 0;

        // 3. Kiểm tra từng phần tử trong mảng details
        this.details.forEach((detail) => {
            // ĐỔI THÀNH "string" để khớp với Schema Prisma của bạn
            if (typeof detail.chapterId !== "string" || typeof detail.percentage !== "number") {
                throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
            }

            if (detail.percentage < 0 || detail.percentage > 100) {
                throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
            }

            totalPercent += detail.percentage;
        });

        // 4. Kiểm tra tổng phần trăm phải bằng 100%
        if (totalPercent !== 100) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
        }
    }
}