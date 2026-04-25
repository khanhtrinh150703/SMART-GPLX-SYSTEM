import { IQuestionProps } from "@/domain/entities/question/question.props";
import { AppError, ErrorCode } from "@/shared/errors";

export interface IQuota {
    chapterId: string;
    quantity: number;
}

export interface IChapterQuota {
  chapterId: string;
  quantity: number;  
}

/**
 * @description Domain Service thực hiện thuật toán bốc đề dựa trên Matrix Quota.
 */
export class ExamGeneratorDomainService {

    /**
     * @description Thực hiện bốc câu hỏi ngẫu nhiên từ kho dữ liệu dựa trên cấu hình ma trận đề (Ma trận chương và số lượng câu liệt).
     * @param {IQuestionProps[]} pool - Kho câu hỏi tổng hợp đã được lọc theo hạng bằng lái.
     * @param {IChapterQuota[]} quotas - Danh sách định mức câu hỏi cần bốc cho từng chương.
     * @param {number} minCritical - Số lượng câu hỏi điểm liệt tối thiểu bắt buộc phải có trong đề.
     * @returns {IQuestionProps[]} Danh sách các câu hỏi đã được chọn lọc và thỏa mãn cấu hình ma trận.
     * @throws {AppError} Ném lỗi nếu số lượng câu hỏi trong kho (pool) không đủ đáp ứng định mức của chương hoặc số lượng câu liệt.
     */
    public static pickByMatrix(
        pool: IQuestionProps[],
        quotas: IChapterQuota[],
        minCritical: number
    ): IQuestionProps[] {
        const selectedQuestions: IQuestionProps[] = [];
        // --- BƯỚC 1: Xử lý nhóm câu hỏi điểm liệt ---
        const criticalPool = pool.filter(q => q.isCritical);

        if (criticalPool.length < minCritical) {
            throw new AppError(
                ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS,
                `Yêu cầu tối thiểu ${minCritical} câu liệt, nhưng kho chỉ có ${criticalPool.length} câu.`
            );
        }

        // Xáo trộn và bốc đủ số lượng câu liệt tối thiểu
        const pickedCritical = this._shuffle(criticalPool).slice(0, minCritical);
        selectedQuestions.push(...pickedCritical);

        // --- BƯỚC 2: Xử lý chỉ tiêu (Quota) từng chương ---
        for (const quota of quotas) {
            // Tính số câu liệt đã bốc ở Bước 1 trùng với chương này
            const currentInSelected = selectedQuestions.filter(
                q => q.chapterId === quota.chapterId
            ).length;

            const neededForChapter = quota.quantity - currentInSelected;

            // Nếu số câu liệt bốc ở B1 đã đủ hoặc vượt chỉ tiêu chương, bỏ qua
            if (neededForChapter <= 0) continue;

            // Lọc pool của chương (loại trừ các câu đã được chọn)
            const chapterPool = pool.filter(
                q => q.chapterId === quota.chapterId &&
                    !selectedQuestions.some(sq => sq.id === q.id)
            );

            // Kiểm tra tính sẵn sàng của kho dữ liệu cho chương này
            if (chapterPool.length < neededForChapter) {
                throw new AppError(
                    ErrorCode.EXAM.INSUFFICIENT_CHAPTER_QUESTIONS,
                    `Chương ID: ${quota.chapterId} không đủ câu hỏi. Cần thêm ${neededForChapter} câu nhưng kho chỉ còn ${chapterPool.length} câu khả dụng.`
                );
            }

            const pickedFromChapter = this._shuffle(chapterPool).slice(0, neededForChapter);
            selectedQuestions.push(...pickedFromChapter);
        }

        // Xáo trộn lần cuối để đảm bảo tính ngẫu nhiên của bộ đề
        return this._shuffle(selectedQuestions);
    }

    /**
     * @description Thực hiện xáo trộn ngẫu nhiên các phần tử trong mảng (Thuật toán Fisher-Yates hoặc Sort ngẫu nhiên).
     * @template T - Kiểu dữ liệu của các phần tử trong mảng.
     * @param {T[]} array - Mảng đầu vào cần xáo trộn.
     * @returns {T[]} Một mảng mới chứa các phần tử đã được thay đổi thứ tự ngẫu nhiên.
     * @private
     */
    private static _shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    }
}