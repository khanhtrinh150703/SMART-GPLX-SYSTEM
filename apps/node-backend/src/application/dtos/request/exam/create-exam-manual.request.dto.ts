import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamStatus } from "@prisma/client";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu tạo bài thi thủ công.
 */
export interface ICreateManualExamInputDTO {
    readonly name: string;
    readonly userId: string;
    readonly licenseCategoryId: string;
    readonly examMatrixId?: string | null;
    readonly totalQuestions?: number;
    readonly passingScore: number;
    readonly durationMinutes: number;
    readonly minCriticalQuestions: number;
    readonly status?: ExamStatus;
    readonly score?: number;
    readonly isPassed?: boolean;
    readonly startedAt?: Date | string;
    readonly endedAt?: Date | string | null;
    readonly questionIds: string[];
    readonly questions?: IExamQuestionProps[];
}

/**
 * @description DTO xử lý khởi tạo bài thi thủ công.
 * Thực hiện gác cổng và chuẩn hóa dữ liệu ngay khi khởi tạo.
 */
export class CreateManualExamRequestDTO implements ICreateManualExamInputDTO {
    public readonly name: string;
    public readonly userId: string;
    public readonly licenseCategoryId: string;
    public readonly examMatrixId: string | null;
    public readonly totalQuestions: number;
    public readonly passingScore: number;
    public readonly durationMinutes: number;
    public readonly minCriticalQuestions: number;
    public readonly status: ExamStatus;
    public readonly score: number;
    public readonly isPassed: boolean;
    public readonly startedAt: Date;
    public readonly endedAt: Date | null;
    public readonly questionIds: string[];
    public readonly questions?: IExamQuestionProps[];

    constructor(data: ICreateManualExamInputDTO) {
        // 1. Chặn đứng dữ liệu lỗi
        this.validate(data);

        // 2. Làm sạch và gán giá trị
        this.name = data.name.trim();
        this.userId = data.userId;
        this.licenseCategoryId = data.licenseCategoryId;
        this.examMatrixId = data.examMatrixId ?? null;

        this.durationMinutes = Number(data.durationMinutes);
        this.passingScore = Number(data.passingScore);
        this.minCriticalQuestions = Number(data.minCriticalQuestions);

        this.status = data.status || ExamStatus.PUBLISHED;
        this.score = Number(data.score || 0);
        this.isPassed = Boolean(data.isPassed || false);

        this.startedAt = data.startedAt ? new Date(data.startedAt) : new Date();
        this.endedAt = data.endedAt ? new Date(data.endedAt) : null;

        this.questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];
        this.totalQuestions = Number(data.totalQuestions) || this.questionIds.length;
        this.questions = data.questions;
    }

    /**
     * @description Hàm gác cổng, thực hiện ném AppError dựa trên logic nghiệp vụ.
     * @private
     */
    private validate(data: ICreateManualExamInputDTO): void {
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // 1. Kiểm tra các trường định danh bắt buộc
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
        }

        if (!data.userId) {
            throw new AppError(ErrorCode.EXAM.USER_ID_REQUIRED);
        }

        if (!data.licenseCategoryId) {
            throw new AppError(ErrorCode.EXAM.LICENSE_CATEGORY_REQUIRED);
        }

        // 2. Kiểm tra logic danh sách câu hỏi
        const hasQuestionIds = Array.isArray(data.questionIds) && data.questionIds.length > 0;
        const hasQuestionsSnapshot = Array.isArray(data.questions) && data.questions.length > 0;

        if (!hasQuestionIds && !hasQuestionsSnapshot) {
            throw new AppError(ErrorCode.EXAM.QUESTIONS_EMPTY);
        }

        // 3. Kiểm tra logic con số
        if (typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
            throw new AppError(ErrorCode.EXAM.INVALID_DURATION);
        }

        // Kiểm tra điểm đạt so với giới hạn câu hỏi
        const limit = data.questions?.length || data.questionIds?.length || 0;
        if (data.passingScore > limit) {
            throw new AppError(ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH);
        }

        if (typeof data.minCriticalQuestions !== 'number' || data.minCriticalQuestions < 0) {
            throw new AppError(ErrorCode.EXAM.MIN_CRITICAL_INVALID);
        }
    }
}