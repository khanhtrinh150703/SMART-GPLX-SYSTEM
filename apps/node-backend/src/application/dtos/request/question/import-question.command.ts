import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho luồng Import câu hỏi.
 */
export interface IImportQuestionInputDTO {
    readonly chapterId: string;
    readonly categoryId: string[];
    readonly content: string;
    readonly difficultyLevel: number;
    readonly indexNumber: number;
    readonly isCritical: boolean;
    readonly imageLocalPath?: string;
    readonly answers: {
        readonly content: string;
        readonly isCorrect: boolean;
        readonly imageLocalPath?: string;
    }[];
}

/**
 * @description DTO xử lý Import câu hỏi từ file/dữ liệu thô.
 * Đảm bảo tính toàn vẹn của cấu trúc câu hỏi và các đáp án đi kèm.
 */
export class ImportQuestionRequestDTO implements IImportQuestionInputDTO {
    public readonly chapterId: string;
    public readonly categoryId: string[];
    public readonly content: string;
    public readonly difficultyLevel: number;
    public readonly indexNumber: number;
    public readonly isCritical: boolean;
    public readonly imageLocalPath?: string;
    public readonly answers: {
        readonly content: string;
        readonly isCorrect: boolean;
        readonly imageLocalPath?: string;
    }[];

    constructor(data: IImportQuestionInputDTO) {
        // 1. Gác cổng dữ liệu ngay khi khởi tạo
        this.validate(data);

        // 2. Chuẩn hóa và gán giá trị
        this.chapterId = data.chapterId;
        this.categoryId = data.categoryId;
        this.content = data.content.trim();
        this.difficultyLevel = Number(data.difficultyLevel);
        this.indexNumber = Number(data.indexNumber);
        this.isCritical = Boolean(data.isCritical);
        this.imageLocalPath = data.imageLocalPath?.trim();

        this.answers = data.answers.map(ans => ({
            content: ans.content.trim(),
            isCorrect: Boolean(ans.isCorrect),
            imageLocalPath: ans.imageLocalPath?.trim()
        }));
    }

    /**
     * @description Kiểm tra logic ràng buộc của câu hỏi và danh sách đáp án.
     * @private
     */
    private validate(data: IImportQuestionInputDTO): void {
        if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

        const { QUESTION } = ErrorCode;

        // 1. Kiểm tra thông tin định danh (Chương và Hạng bằng)
        if (!data.chapterId) {
            throw new AppError(QUESTION.CHAPTER_REQUIRED);
        }

        if (!Array.isArray(data.categoryId) || data.categoryId.length === 0) {
            throw new AppError(QUESTION.LICENSE_REQUIRED);
        }

        // 2. Kiểm tra nội dung câu hỏi
        if (!data.content || data.content.trim().length === 0) {
            throw new AppError(QUESTION.CONTENT_INVALID);
        }

        // 3. Kiểm tra các thông số kỹ thuật (Độ khó và Thứ tự)
        if (data.difficultyLevel === undefined || isNaN(Number(data.difficultyLevel)) || Number(data.difficultyLevel) < 0) {
            throw new AppError(QUESTION.DIFFICULTY_INVALID);
        }

        if (data.indexNumber === undefined || isNaN(Number(data.indexNumber)) || Number(data.indexNumber) < 0) {
            throw new AppError(QUESTION.INDEX_INVALID);
        }

        // 4. Kiểm tra cấu trúc đáp án
        if (!Array.isArray(data.answers) || data.answers.length < 2) {
            throw new AppError(QUESTION.ANSWERS_INSUFFICIENT);
        }

        let correctCount = 0;
        for (const ans of data.answers) {
            if (!ans.content || ans.content.trim().length === 0) {
                throw new AppError(QUESTION.ANSWER_CONTENT_REQUIRED);
            }
            if (ans.isCorrect === true || String(ans.isCorrect).toLowerCase() === 'true') {
                correctCount++;
            }
        }

        // Logic nghiệp vụ: Một câu hỏi phải có ít nhất một đáp án đúng
        if (correctCount === 0) {
            throw new AppError(QUESTION.CORRECT_ANSWER_MISSING);
        }
    }
}