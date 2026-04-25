import { IExamMatrixProps } from "@/domain/entities/exam-matrix/exam-matrix.props";
import { IQuestionProps } from "@/domain/entities/question/question.props";
import { AppError, ErrorCode } from "@/shared/errors";

export class ExamPickerDomainService {

  /**
   * @description Thực thi lọc và bốc câu hỏi theo đúng định mức ma trận.
   * @param {IQuestionProps[]} pool - Kho câu hỏi đã lọc theo hạng.
   * @param {IExamMatrixProps} matrix - Cấu hình ma trận chi tiết.
   * @returns {IQuestionProps[]} Bộ câu hỏi hoàn chỉnh cho đề thi.
   */
  public static execute(pool: IQuestionProps[], matrix: IExamMatrixProps): IQuestionProps[] {
    const selected: IQuestionProps[] = [];

    // --- BƯỚC 0: CHECK TỔNG KHO ---
    // Nếu tổng kho còn ít hơn cả số lượng đề yêu cầu thì nghỉ khỏe luôn
    if (pool.length < matrix.totalQuestions) {
      throw new AppError(ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS);
    }

    // --- BƯỚC 1: TÍNH TOÁN QUOTA ---
    const chapterQuotas = matrix.details.map(detail => ({
      chapterId: detail.chapterId,
      quantity: Math.round((detail.percentage * matrix.totalQuestions) / 100)
    }));

    // --- BƯỚC 2: BỐC CÂU ĐIỂM LIỆT (BẮT BUỘC) ---
    const criticalPool = this._shuffle(pool.filter(q => q.isCritical));
    if (criticalPool.length < matrix.minCriticalQuestions) {
      throw new AppError(ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS);
    }
    selected.push(...criticalPool.slice(0, matrix.minCriticalQuestions));

    // --- BƯỚC 3: BỐC THEO CHƯƠNG (ƯU TIÊN) ---
    for (const quota of chapterQuotas) {
      const alreadyPicked = selected.filter(q => q.chapterId === quota.chapterId).length;
      const needed = quota.quantity - alreadyPicked;

      if (needed <= 0) continue;

      // Lọc những câu thuộc chương này mà chưa được bốc ở B2
      const chapterPool = this._shuffle(
        pool.filter(q => q.chapterId === quota.chapterId && !selected.some(s => s.id === q.id))
      );

      // Thay vì throw error, ta lấy tối đa những gì chương này có
      const canTake = Math.min(needed, chapterPool.length);
      selected.push(...chapterPool.slice(0, canTake));
    }

    // --- BƯỚC 4: BỐC BÙ (FALLBACK) ---
    // Nếu sau khi đi hết các chương mà vẫn chưa đủ tổng số câu (do một số chương bị thiếu)
    const remainingNeeded = matrix.totalQuestions - selected.length;

    if (remainingNeeded > 0) {
      // Lọc tất cả những câu còn lại trong kho chưa được bốc
      const leftoverPool = this._shuffle(
        pool.filter(q => !selected.some(s => s.id === q.id))
      );

      // Nếu kho còn lại không đủ để bù thì lúc này mới ném lỗi "vét kho"
      if (leftoverPool.length < remainingNeeded) {
        throw new AppError(ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS);
      }

      selected.push(...leftoverPool.slice(0, remainingNeeded));
    }

    // --- BƯỚC 5: XÁO TRỘN LẦN CUỐI ---
    return this._shuffle(selected);
  }

  /**
    * @description Xáo trộn ngẫu nhiên các phần tử trong mảng bằng thuật toán sắp xếp ngẫu nhiên.
    * @description Hàm sử dụng toán tử spread để tạo bản sao, đảm bảo tính bất biến (immutability) cho mảng gốc.
    * @template T - Kiểu dữ liệu của các phần tử trong mảng.
    * @param {T[]} array - Mảng các phần tử cần xáo trộn.
    * @returns {T[]} Một mảng mới đã được thay đổi thứ tự các phần tử một cách ngẫu nhiên.
    * @private
    * @static
    */
  private static _shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}