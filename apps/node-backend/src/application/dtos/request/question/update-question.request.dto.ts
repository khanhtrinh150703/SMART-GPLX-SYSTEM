import { QuestionStatus } from "@/domain/entities/question/question.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Cấu trúc đáp án trong yêu cầu cập nhật.
 * Đã bỏ hoàn toàn null, dùng optional hoặc string rỗng.
 */
export interface IUpdateAnswerPayload {
    id?: string;             // Có ID: Update/Keep - Không ID: Create new
    content: string;
    isCorrect: boolean;
    imageUrl: string;        // URL ảnh cũ (mặc định là chuỗi rỗng)
    imageIndex?: number;     // Vị trí file trong mảng answerFiles
    imageFile?: IUploadedFile;
}

/**
 * @description Dữ liệu thô từ Controller (Thường từ FormData)
 */
export interface IUpdateQuestionInputDTO {
    readonly id: string;
    readonly chapterId: string;
    readonly content: string;
    readonly licenseCategoryIds: string | string[];
    readonly answers: string | IUpdateAnswerPayload[];
    readonly isCritical: string | boolean;
    readonly status: QuestionStatus;
    readonly difficultyLevel: string | number;
    readonly imageFile?: IUploadedFile;
    readonly answerFiles?: IUploadedFile[];
    readonly indexNumber: string | number;
}

/**
 * @description DTO xử lý cập nhật thông tin câu hỏi.
 * Chuyển đổi dữ liệu từ FormData (string) sang kiểu dữ liệu nghiệp vụ chuẩn.
 */
export class UpdateQuestionRequestDTO implements IUpdateQuestionInputDTO {
    public readonly id: string;
    public readonly chapterId: string;
    public readonly content: string;
    public readonly licenseCategoryIds: string[];
    public readonly answers: IUpdateAnswerPayload[];
    public readonly isCritical: boolean;
    public readonly status: QuestionStatus;
    public readonly difficultyLevel: number;
    public readonly imageFile?: IUploadedFile;
    public readonly indexNumber: number;

    constructor(data: IUpdateQuestionInputDTO) {
        // 1. Gác cổng dữ liệu ngay từ constructor
        this.validate(data);

        // 2. Ép kiểu và chuẩn hóa dữ liệu cơ bản
        this.id = String(data.id);
        this.chapterId = String(data.chapterId);
        this.content = String(data.content).trim();
        this.imageFile = data.imageFile;
        this.difficultyLevel = Number(data.difficultyLevel) || 1;
        this.indexNumber = Number(data.indexNumber) || 1;
        this.status = data.status ?? 'ACTIVE';

        // Xử lý boolean từ string (FormData gửi 'true'/'false')
        this.isCritical = String(data.isCritical).toLowerCase() === 'true';

        // 3. Xử lý mảng licenseCategoryIds (Hỗ trợ JSON string hoặc mảng thô)
        this.licenseCategoryIds = this._parseLicenseCategories(data.licenseCategoryIds);

        // 4. Xử lý mảng answers & Ánh xạ file vật lý
        const rawAnswers = this._parseAnswersJson(data.answers);

        this.answers = rawAnswers.map((ans) => {
            const processed: IUpdateAnswerPayload = {
                id: ans.id,
                content: String(ans.content || '').trim(),
                isCorrect: String(ans.isCorrect) === 'true' || ans.isCorrect === true,
                imageUrl: ans.imageUrl || '',
                imageIndex: ans.imageIndex !== undefined ? Number(ans.imageIndex) : undefined,
            };

            // Map file vật lý dựa trên imageIndex từ mảng answerFiles
            if (
                processed.imageIndex !== undefined &&
                data.answerFiles &&
                data.answerFiles[processed.imageIndex]
            ) {
                processed.imageFile = data.answerFiles[processed.imageIndex];
            }

            return processed;
        });
    }

    /**
     * @description Hàm gác cổng thực hiện ném AppError dựa trên mã lỗi hệ thống.
     * @private
     */
    private validate(data: IUpdateQuestionInputDTO): void {
        if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

        const { QUESTION } = ErrorCode;

        // 1. Kiểm tra định danh bắt buộc
        if (!data.id || data.id.trim() === '') {
            throw new AppError(QUESTION.ID_REQUIRED);
        }

        if (!data.chapterId) {
            throw new AppError(QUESTION.CHAPTER_REQUIRED);
        }

        // 2. Kiểm tra nội dung câu hỏi
        if (!data.content || data.content.trim().length < 10) {
            throw new AppError(QUESTION.CONTENT_INVALID);
        }

        // 3. Kiểm tra danh mục hạng bằng lái (Phải có ít nhất 1 hạng)
        if (!Array.isArray(data.licenseCategoryIds) || data.licenseCategoryIds.length === 0) {
            throw new AppError(QUESTION.LICENSE_REQUIRED);
        }

        // 4. Kiểm tra logic đáp án (Tận dụng logic từ Create Question)
        if (!Array.isArray(data.answers) || data.answers.length < 2) {
            throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
        }

        const hasCorrect = data.answers.some(ans => ans.isCorrect === true);
        if (!hasCorrect) {
            throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
        }

        // 5. Kiểm tra các thông số kỹ thuật (Cần đảm bảo là số hợp lệ sau khi transform)
        if (typeof data.difficultyLevel !== 'number' || data.difficultyLevel < 0) {
            throw new AppError(QUESTION.DIFFICULTY_INVALID);
        }

        if (typeof data.indexNumber !== 'number' || data.indexNumber < 0) {
            throw new AppError(QUESTION.INDEX_INVALID);
        }

        // 6. Kiểm tra kiểu dữ liệu cho isCritical
        if (typeof data.isCritical !== 'boolean') {
            throw new AppError(QUESTION.IS_CRITICAL_INVALID);
        }
    }

    /**
     * @private Parse mảng License IDs dựa trên kiểu dữ liệu string | string[]
     */
    private _parseLicenseCategories(input: string | string[]): string[] {
        if (Array.isArray(input)) return input;

        const trimmed = input.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
        } catch {
            return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    /**
     * @private Parse JSON an toàn cho mảng answers
     */
    private _parseAnswersJson(input: string | IUpdateAnswerPayload[]): IUpdateAnswerPayload[] {
        if (Array.isArray(input)) return input;

        if (typeof input === 'string' && input.trim() !== '') {
            try {
                const parsed = JSON.parse(input);
                return Array.isArray(parsed) ? (parsed as IUpdateAnswerPayload[]) : [];
            } catch {
                return [];
            }
        }
        return [];
    }

    /**
     * @description Xác thực nghiệp vụ chuyên sâu trước khi đẩy vào Service
     */
    public isValid(): void {
        const { QUESTION } = ErrorCode;

        if (this.licenseCategoryIds.length === 0) throw new AppError(QUESTION.LICENSE_REQUIRED);
        if (this.answers.length < 2) throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);

        const hasCorrect = this.answers.some(a => a.isCorrect);
        if (!hasCorrect) throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
    }
}