import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamStatus } from "@prisma/client";

/**
 * @class CreateManualExamDTO
 * @description DTO xử lý khởi tạo bài thi thủ công. 
 * Cho phép Admin can thiệp vào toàn bộ thông số (Full Access) trừ ID.
 */
export class CreateManualExamDTO {
    // 1. Thông tin định danh & Quan hệ
    public readonly name: string;
    public readonly userId: string;
    public readonly licenseCategoryId: string;
    public readonly examMatrixId: string | null;

    // 2. Cấu hình Snapshot (Quy tắc đề thi)
    public readonly totalQuestions: number;
    public readonly passingScore: number;
    public readonly durationMinutes: number;
    public readonly minCriticalQuestions: number;

    // 3. Trạng thái & Kết quả thực thi
    public readonly status: ExamStatus;
    public readonly score: number;
    public readonly isPassed: boolean;

    // 4. Mốc thời gian
    public readonly startedAt: Date;
    public readonly endedAt: Date | null;

    // 5. Dữ liệu câu hỏi (Chọn thủ công)
    public readonly questionIds: string[]; 
    public readonly questions?: IExamQuestionProps[]; // Dành cho trường hợp truyền thẳng snapshot

    constructor(data: Record<string, unknown>) {
        // --- Mapping thông tin cơ bản ---
        this.name = String(data.name || '').trim();
        this.userId = String(data.userId || '');
        this.licenseCategoryId = String(data.licenseCategoryId || '');
        this.examMatrixId = data.examMatrixId ? String(data.examMatrixId) : null;

        // --- Mapping thông số kỹ thuật (Casting Number) ---
        this.durationMinutes = Number(data.durationMinutes || 0);
        this.passingScore = Number(data.passingScore || 0);
        this.minCriticalQuestions = Number(data.minCriticalQuestions || 0);

        // --- Mapping trạng thái & kết quả (Cho phép override khi tạo) ---
        this.status = (data.status as ExamStatus) || ExamStatus.PUBLISHED;
        this.score = Number(data.score || 0);
        this.isPassed = Boolean(data.isPassed || false);

        // --- Mapping thời gian ---
        this.startedAt = data.startedAt ? new Date(String(data.startedAt)) : new Date();
        this.endedAt = data.endedAt ? new Date(String(data.endedAt)) : null;

        // --- Xử lý danh sách câu hỏi ---
        this.questionIds = Array.isArray(data.questionIds)
            ? data.questionIds.map(id => String(id))
            : [];
        
        // Tự động tính hoặc dùng giá trị truyền vào
        this.totalQuestions = Number(data.totalQuestions) || this.questionIds.length;

        // Metadata nếu có
        if (Array.isArray(data.questions)) {
            this.questions = data.questions as IExamQuestionProps[];
        }
    }

    /**
     * @description Kiểm tra tính hợp lệ của dữ liệu trước khi thực thi.
     */
    public isValid(): void {
        // 1. Kiểm tra các trường định danh bắt buộc
        if (!this.name) throw new AppError(ErrorCode.VALIDATION.NAME_REQUIRED);
        if (!this.userId) throw new AppError(ErrorCode.VALIDATION.USER_ID_REQUIRED);
        if (!this.licenseCategoryId) throw new AppError(ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED);

        // 2. Kiểm tra logic danh sách câu hỏi
        // Nếu không truyền snapshot questions thì bắt buộc phải có questionIds để bốc
        if (this.questionIds.length === 0 && (!this.questions || this.questions.length === 0)) {
            throw new AppError(ErrorCode.VALIDATION.EXAM_QUESTIONS_EMPTY);
        }

        // 3. Kiểm tra logic con số
        if (isNaN(this.durationMinutes) || this.durationMinutes <= 0) {
            throw new AppError(ErrorCode.VALIDATION.INVALID_DURATION);
        }

        // Kiểm tra điểm đạt so với tổng số câu (tránh logic phi lý)
        const limit = this.questions?.length || this.questionIds.length;
        if (this.passingScore > limit) {
            throw new AppError(ErrorCode.VALIDATION.PASSING_SCORE_TOO_HIGH);
        }
        
        if (this.minCriticalQuestions < 0) {
            throw new AppError(ErrorCode.VALIDATION.MIN_CRITICAL_INVALID);
        }
    }
}