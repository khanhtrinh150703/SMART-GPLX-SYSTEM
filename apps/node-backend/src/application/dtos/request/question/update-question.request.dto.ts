import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface UpdateAnswerPayload
 * @description Cấu trúc đáp án trong yêu cầu cập nhật. 
 * 'id' để rỗng nếu là đáp án mới được thêm vào.
 */
export interface UpdateAnswerPayload {
    id?: string;
    content: string;
    isCorrect: boolean;
    imageUrl?: string | null;
}

/**
 * @class UpdateQuestionDto
 * @description DTO vận chuyển dữ liệu cập nhật câu hỏi.
 */
export class UpdateQuestionRequestDto {
    public readonly id!: string;
    public readonly chapterId!: string;
    public readonly content!: string;
    public readonly licenseCategoryIds!: string[];
    public readonly answers!: UpdateAnswerPayload[];
    public readonly isCritical: boolean;
    public readonly imageUrl: string | null;
    public readonly difficultyLevel: number;

    constructor(data: Partial<UpdateQuestionRequestDto>) {
        Object.assign(this, data);

        this.difficultyLevel = data.difficultyLevel ?? 1;
        this.imageUrl = data.imageUrl ?? null;
        this.isCritical = data.isCritical ?? false;
    }

    /**
     * @description Xác thực dữ liệu cập nhật. 
     * Đảm bảo tính toàn vẹn của câu hỏi trước khi đưa xuống Service.
     */
    public isValid(): void {
        const { QUESTION } = ErrorCode;

        // 1. Kiểm tra ID câu hỏi (Bắt buộc phải có để update)
        if (!this.id) {
            throw new AppError(QUESTION.NOT_FOUND); // Hoặc một mã lỗi INVALID_ID tùy cậu
        }

        // 2. Kiểm tra ID chương
        if (!this.chapterId) {
            throw new AppError(QUESTION.CHAPTER_REQUIRED);
        }

        // 3. Kiểm tra nội dung câu hỏi
        if (!this.content || this.content.trim().length < 10) {
            throw new AppError(QUESTION.CONTENT_INVALID);
        }

        // 4. Kiểm tra danh sách hạng bằng lái
        if (!this.licenseCategoryIds || this.licenseCategoryIds.length === 0) {
            throw new AppError(QUESTION.LICENSE_REQUIRED);
        }

        // 5. Kiểm tra số lượng đáp án (Tối thiểu 2)
        if (!this.answers || this.answers.length < 2) {
            throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
        }

        // 6. Kiểm tra đáp án đúng (Phải có ít nhất 1 cái đúng)
        const hasCorrectAnswer = this.answers.some((a) => a.isCorrect);
        if (!hasCorrectAnswer) {
            throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
        }

        // 7. Kiểm tra format ảnh minh họa (Nếu có)
        if (this.imageUrl && !this.imageUrl.startsWith('http')) {
            throw new AppError(QUESTION.IMAGE_URL_INVALID);
        }
    }
}