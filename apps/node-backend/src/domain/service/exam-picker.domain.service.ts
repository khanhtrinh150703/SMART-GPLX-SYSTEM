import { IExamMatrixProps } from "@/domain/entities/exam-matrix/exam-matrix.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamPickerDomainService } from "../interfaces/services/exam-engine/i-exam-picker.service";
import { Question } from "../entities/question/question.entity";

export class ExamPickerDomainService implements IExamPickerDomainService {

  /**
     * @description Thực thi thuật toán bốc câu hỏi.
     * @param {Question[]} pool - Tổng kho câu hỏi khả dụng cho hạng bằng lái.
     * @param {IExamMatrixProps} matrixProps - Cấu hình ma trận đề thi.
     * @returns {Question[]} Danh sách thực thể câu hỏi đã được chọn và xáo trộn.
     */
  public execute(pool: Question[], matrixProps: IExamMatrixProps): Question[] {
    const selected: Question[] = [];

    // --- BƯỚC 0: KIỂM TRA TỔNG KHO ---
    if (pool.length < matrixProps.totalQuestions) {
      throw new AppError(ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS);
    }

    // --- BƯỚC 1: TÍNH TOÁN ĐỊNH MỨC (QUOTA) ---
    const chapterQuotas = matrixProps.details.map(detail => ({
      chapterId: detail.chapterId,
      quantity: Math.round((detail.percentage * matrixProps.totalQuestions) / 100)
    }));

    // --- BƯỚC 2: BỐC CÂU ĐIỂM LIỆT (BẮT BUỘC) ---
    const criticalPool = this._shuffle(pool.filter(q => q.props.isCritical));

    if (criticalPool.length < matrixProps.minCriticalQuestions) {
      throw new AppError(ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS);
    }

    // Ưu tiên đưa các câu điểm liệt vào danh sách chọn
    selected.push(...criticalPool.slice(0, matrixProps.minCriticalQuestions));

    // --- BƯỚC 3: BỐC THEO CHƯƠNG (ƯU TIÊN THEO MA TRẬN) ---
    for (const quota of chapterQuotas) {
      if (selected.length >= matrixProps.totalQuestions) break;

      const alreadyPickedInChapter = selected.filter(q => q.props.chapterId === quota.chapterId).length;
      const neededForChapter = quota.quantity - alreadyPickedInChapter;

      if (neededForChapter <= 0) continue;

      const remainingTotalNeeded = matrixProps.totalQuestions - selected.length;
      const actualTake = Math.min(neededForChapter, remainingTotalNeeded);

      // Lọc các câu thuộc chương này mà chưa được bốc ở bước điểm liệt
      const chapterPool = this._shuffle(
        pool.filter(q => q.props.chapterId === quota.chapterId && !selected.some(s => s.id === q.id))
      );

      const canTakeFromPool = Math.min(actualTake, chapterPool.length);
      selected.push(...chapterPool.slice(0, canTakeFromPool));
    }

    // --- BƯỚC 4: BỐC BÙ (FALLBACK) ---
    // Nếu vẫn chưa đủ tổng số câu (do kho của một số chương bị thiếu so với quota)
    const remainingNeeded = matrixProps.totalQuestions - selected.length;

    if (remainingNeeded > 0) {
      const leftoverPool = this._shuffle(
        pool.filter(q => !selected.some(s => s.id === q.id))
      );

      if (leftoverPool.length < remainingNeeded) {
        throw new AppError(ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS);
      }

      selected.push(...leftoverPool.slice(0, remainingNeeded));
    }

    // --- BƯỚC 5: XÁO TRỘN LẦN CUỐI ĐỂ ĐẢM BẢO TÍNH NGẪU NHIÊN ---
    return this._shuffle(selected);
  }

  /**
   * @description Thuật toán xáo trộn mảng (Fisher-Yates).
   */
  private _shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}