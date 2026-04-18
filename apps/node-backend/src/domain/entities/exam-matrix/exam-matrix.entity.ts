import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixProps } from "./exam-matrix.props";
/**
 * @description Rich Domain Model cho Ma trận đề thi.
 * Đảm bảo tính toàn vẹn của cấu trúc đề ngay từ khi khởi tạo.
 */
export class ExamMatrix {
    private constructor(private readonly _props: IExamMatrixProps) { }

    public static create(props: IExamMatrixProps): ExamMatrix {
        const instance = new ExamMatrix(props);
        instance.validate();
        return instance;
    }

    // Getters
    get id() { return this._props.id; }
    get props() { return this._props; }

    /**
     * @description Quy tắc nghiệp vụ bắt buộc: 
     * 1. Tổng % các chương phải bằng 100%.
     * 2. Điểm đạt không được cao hơn tổng số câu.
     */
    private validate(): void {
        // Kiểm tra danh sách chi tiết trống
        if (this._props.details.length === 0) {
            throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
        }
        const chapterIds = this._props.details.map(d => d.chapterId);
        const uniqueChapters = new Set(chapterIds);
        if (uniqueChapters.size !== chapterIds.length) {
            throw new AppError(ErrorCode.MATRIX.DUPLICATE_CHAPTER);
        }
        // Kiểm tra tổng phần trăm
        const totalPercent = this._props.details.reduce((sum, d) => sum + d.percentage, 0);
        if (totalPercent !== 100) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
        }

        // Kiểm tra điểm đạt (passing score) không được vượt quá tổng số câu
        if (this._props.passingScore > this._props.totalQuestions) {
            throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
        }
    }

    /**
     * @description Kiểm tra xem thực thể có đang trong trạng thái bị xóa hay không.
     * @returns {boolean} True nếu đã bị xóa mềm.
     */
    public isDeleted(): boolean {
        return !!this.props.deletedAt;
    }
}