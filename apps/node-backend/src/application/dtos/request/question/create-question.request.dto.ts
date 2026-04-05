import { AppError, ErrorCode } from "@/shared/errors";

export interface CreateAnswerPayload {
    content: string;
    isCorrect: boolean;
}

/**
 * @class CreateQuestionDto
 * @description DTO vận chuyển dữ liệu tạo câu hỏi mới.
 */
export class CreateQuestionRequestDto {
    public readonly chapterId!: string;
    public readonly content!: string;
    public readonly licenseCategoryIds!: string[];
    public readonly answers!: CreateAnswerPayload[];
    public readonly isCritical: boolean;
    public readonly difficultyLevel: number;
    public readonly imageUrl: string | null;

    constructor(data: Partial<CreateQuestionRequestDto>) {
        Object.assign(this, data);
        
        this.difficultyLevel = data.difficultyLevel ?? 1;
        this.imageUrl = data.imageUrl ?? null;
        this.isCritical = data.isCritical ?? false;
    }

    /**
     * @description Tự xác thực dữ liệu đầu vào từ Client.
     * @throws {AppError} Nếu vi phạm các quy tắc nghiệp vụ cơ bản.
     */
    public isValid(): void {
        const { QUESTION } = ErrorCode;

        // 1. Kiểm tra ID chương
        if (!this.chapterId) {
            throw new AppError(QUESTION.CHAPTER_REQUIRED);
        }

        // 2. Kiểm tra nội dung câu hỏi
        if (!this.content || this.content.trim().length < 10) {
            throw new AppError(QUESTION.CONTENT_INVALID);
        }

        // 3. Kiểm tra danh sách hạng bằng lái
        if (!this.licenseCategoryIds || this.licenseCategoryIds.length === 0) {
            throw new AppError(QUESTION.LICENSE_REQUIRED);
        }

        // 4. Kiểm tra số lượng đáp án
        if (!this.answers || this.answers.length < 2) {
            throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
        }

        // 5. Kiểm tra đáp án đúng
        const hasCorrectAnswer = this.answers.some((a) => a.isCorrect);
        if (!hasCorrectAnswer) {
            throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
        }

        // 6. Kiểm tra format ảnh (Nếu có)
        if (this.imageUrl && !this.imageUrl.startsWith('http')) {
            throw new AppError(QUESTION.IMAGE_URL_INVALID);
        }
    }
}