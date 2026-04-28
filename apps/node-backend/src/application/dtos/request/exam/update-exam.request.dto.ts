import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamStatus } from "@prisma/client";

export class UpdateExamDTO {
    public readonly id: string;
    public readonly name?: string;
    public readonly userId?: string;
    public readonly examMatrixId?: string | null;
    public readonly licenseCategoryId?: string;

    // Cấu hình đề thi (Snapshot Config)
    public readonly totalQuestions?: number;
    public readonly passingScore?: number;
    public readonly durationMinutes?: number;
    public readonly minCriticalQuestions?: number;

    // Trạng thái & Kết quả
    public readonly status?: ExamStatus;
    public readonly score?: number;
    public readonly isPassed?: boolean;

    // Thời gian
    public readonly startedAt?: Date;
    public readonly endedAt?: Date | null;

    // Metadata & Quan hệ lồng nhau
    public readonly questions?: IExamQuestionProps[];
    public readonly userName?: string;
    public readonly licenseCategoryName?: string;

    constructor(data: Record<string, unknown>) {
        this.id = String(data.id || '');

        // Sử dụng kỹ thuật check undefined để chỉ gán những gì Client gửi lên
        if (data.name !== undefined) this.name = String(data.name).trim();
        if (data.userId !== undefined) this.userId = String(data.userId);
        if (data.examMatrixId !== undefined) this.examMatrixId = data.examMatrixId ? String(data.examMatrixId) : null;
        if (data.licenseCategoryId !== undefined) this.licenseCategoryId = String(data.licenseCategoryId);

        if (data.totalQuestions !== undefined) this.totalQuestions = Number(data.totalQuestions);
        if (data.passingScore !== undefined) this.passingScore = Number(data.passingScore);
        if (data.durationMinutes !== undefined) this.durationMinutes = Number(data.durationMinutes);
        if (data.minCriticalQuestions !== undefined) this.minCriticalQuestions = Number(data.minCriticalQuestions);

        if (data.status !== undefined) this.status = data.status as ExamStatus;
        if (data.score !== undefined) this.score = Number(data.score);
        if (data.isPassed !== undefined) this.isPassed = Boolean(data.isPassed);

        if (data.startedAt !== undefined) this.startedAt = new Date(String(data.startedAt));
        if (data.endedAt !== undefined) this.endedAt = data.endedAt ? new Date(String(data.endedAt)) : null;

        if (Array.isArray(data.questions)) {
            this.questions = data.questions;
        }
    }

    public isValid(): void {
        // 1. Kiểm tra ID bắt buộc cho thao tác cập nhật
        // "Update operation requires a valid ID"
        // (Thao tác cập nhật yêu cầu một ID hợp lệ)
        if (!this.id || this.id.trim() === '') {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 2. Kiểm tra Tên (nếu có gửi lên)
        // "Exam name cannot be empty if provided"
        // (Tên bài thi không được để trống nếu được cung cấp)
        if (this.name !== undefined && this.name.trim() === '') {
            throw new AppError(ErrorCode.EXAM.NAME_REQUIRED);
        }

        // 3. Kiểm tra các ID quan hệ (nếu có gửi lên)
        if (this.userId !== undefined && !this.userId) {
            throw new AppError(ErrorCode.VALIDATION.USER_ID_REQUIRED);
        }

        if (this.licenseCategoryId !== undefined && !this.licenseCategoryId) {
            throw new AppError(ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED);
        }

        // 4. Kiểm tra logic con số (Numeric Logic)
        // "Duration must be a positive number"
        // (Thời gian làm bài phải là một số dương)
        if (this.durationMinutes !== undefined && (isNaN(this.durationMinutes) || this.durationMinutes <= 0)) {
            throw new AppError(ErrorCode.VALIDATION.INVALID_DURATION);
        }

        // "Score and total questions validation"
        // (Kiểm tra tính hợp lệ của điểm số và tổng số câu hỏi)
        if (this.totalQuestions !== undefined && this.totalQuestions <= 0) {
            throw new AppError(ErrorCode.VALIDATION.EXAM_QUESTIONS_EMPTY);
        }

        // 5. Kiểm tra logic chéo (Cross-field validation)
        // Nếu cập nhật cả điểm đạt và tổng số câu, hoặc chỉ cập nhật một trong hai
        // "Passing score cannot exceed the total number of questions"
        // (Điểm đạt không được vượt quá tổng số câu hỏi)
        if (this.passingScore !== undefined) {
            const total = this.totalQuestions || this.questions?.length || 0;
            if (total > 0 && this.passingScore > total) {
                throw new AppError(ErrorCode.VALIDATION.PASSING_SCORE_TOO_HIGH);
            }
        }

        // 6. Kiểm tra câu hỏi điểm liệt (nếu có)
        if (this.minCriticalQuestions !== undefined && this.minCriticalQuestions < 0) {
            throw new AppError(ErrorCode.VALIDATION.MIN_CRITICAL_INVALID);
        }

        // 7. Kiểm tra logic thời gian (nếu cập nhật cả hai)
        // "The end time must occur after the start time"
        // (Thời gian kết thúc phải diễn ra sau thời gian bắt đầu)
        if (this.startedAt && this.endedAt) {
            if (this.endedAt.getTime() <= this.startedAt.getTime()) {
                throw new AppError(ErrorCode.EXAM.EXPIRED); // Hoặc một mã lỗi logic thời gian phù hợp
            }
        }
    }
}