import { AppError, ErrorCode } from "@/shared/errors";
import { ExamMatrixDetailRequestDTO } from "./exam-matrix-detail.request";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo Ma trận đề thi.
 */
export interface ICreateExamMatrixInputDTO {
    readonly licenseCategoryId: string;
    readonly name: string;
    readonly totalQuestions: number;
    readonly passingScore: number;
    readonly durationMinutes: number;
    readonly minCriticalQuestions: number;
    readonly isDefault: boolean;
    readonly details: ExamMatrixDetailRequestDTO[];
}

/**
 * @description DTO xử lý tạo mới Ma trận đề thi.
 * Thực hiện gác cổng và kiểm tra logic ràng buộc ngay khi khởi tạo.
 */
export class CreateExamMatrixRequestDTO implements ICreateExamMatrixInputDTO {
    public readonly licenseCategoryId: string;
    public readonly name: string;
    public readonly totalQuestions: number;
    public readonly passingScore: number;
    public readonly durationMinutes: number;
    public readonly minCriticalQuestions: number;
    public readonly isDefault: boolean;
    public readonly details: ExamMatrixDetailRequestDTO[];

    constructor(data: ICreateExamMatrixInputDTO) {
        this.validate(data);

        this.licenseCategoryId = data.licenseCategoryId;
        this.name = data.name.trim();
        this.totalQuestions = data.totalQuestions;
        this.passingScore = data.passingScore;
        this.durationMinutes = data.durationMinutes;
        this.minCriticalQuestions = data.minCriticalQuestions;
        this.isDefault = data.isDefault;
        this.details = data.details;
    }

    private validate(data: ICreateExamMatrixInputDTO): void {
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // 1. Kiểm tra các trường bắt buộc (không được null/undefined)
        const mandatoryFields = [
            data.licenseCategoryId,
            data.totalQuestions,
            data.passingScore,
            data.durationMinutes,
            data.minCriticalQuestions,
            data.name,
            data.isDefault,
        ];

        if (mandatoryFields.some(field => field === undefined || field === null)) {
            throw new AppError(ErrorCode.MATRIX.MISSING_FIELDS);
        }

        // 2. Kiểm tra định danh và tên
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError(ErrorCode.MATRIX.NAME_REQUIRED);
        }

        if (data.name.length > 100) {
            throw new AppError(ErrorCode.MATRIX.NAME_TOO_LONG);
        }

        if (!data.licenseCategoryId) {
            throw new AppError(ErrorCode.MATRIX.LICENSE_CATEGORY_REQUIRED);
        }

        // 3. Kiểm tra các thông số kỹ thuật
        if (data.totalQuestions <= 0) {
            throw new AppError(ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS);
        }

        if (data.passingScore <= 0) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
        }

        if (data.durationMinutes <= 0) {
            throw new AppError(ErrorCode.MATRIX.INVALID_DURATION);
        }

        if (data.passingScore > data.totalQuestions) {
            throw new AppError(ErrorCode.MATRIX.PASSING_SCORE_TOO_HIGH);
        }

        // 4. Kiểm tra cấu trúc chi tiết (Details)
        if (!Array.isArray(data.details) || data.details.length === 0) {
            throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
        }

        let totalPercent = 0;
        data.details.forEach((detail) => {
            if (!detail.chapterId || typeof detail.percentage !== "number") {
                throw new AppError(ErrorCode.MATRIX.CHAPTER_ID_REQUIRED);
            }

            if (detail.percentage < 0 || detail.percentage > 100) {
                throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
            }

            totalPercent += detail.percentage;
        });

        if (totalPercent !== 100) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
        }
    }
}