import { IExamMatrixProps } from "@/domain/entities/exam-matrix/exam-matrix.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamPickerDomainService } from "../interfaces/services/exam-engine/commands/i-exam-picker.service";
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
    const allowedChapterIds = matrixProps.details.map((d) => d.chapterId);

    // Ranh giới chương
    const restrictedPool = pool.filter((q) =>
      allowedChapterIds.includes(q.props.chapterId),
    );

    // --- BƯỚC 1: TÍNH QUOTA (Giữ nguyên) ---
    const totalReq = matrixProps.totalQuestions;
    const quotas = matrixProps.details.map((d) => {
      const raw = (d.percentage * totalReq) / 100;
      return {
        chapterId: d.chapterId,
        quantity: Math.max(1, Math.floor(raw)),
        remainder: raw - Math.floor(raw),
      };
    });
    // ... (Logic xử lý lệch diff giữ nguyên) ...

    const chapterQuotas = quotas.map((q) => ({
      chapterId: q.chapterId,
      quantity: q.quantity,
    }));

    // --- BƯỚC 2: BỐC CÂU ĐIỂM LIỆT (BẮT BUỘC) ---
    const criticalPool = this._shuffle(
      restrictedPool.filter((q) => q.props.isCritical),
    );

    if (criticalPool.length < matrixProps.minCriticalQuestions) {
      throw new AppError(ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS);
    }

    const criticals = criticalPool.slice(0, matrixProps.minCriticalQuestions);
    selected.push(...criticals);

    // --- [QUAN TRỌNG] BƯỚC TRUNG GIAN: TẠO KHO CÂU THƯỜNG ---
    // Dịch: Create a non-critical pool by excluding ALL remaining critical questions.
    // Loại bỏ hoàn toàn những câu điểm liệt chưa được chọn để không bị bốc nhầm ở bước sau.
    const nonCriticalPool = restrictedPool.filter(
      (q) => !q.props.isCritical && !selected.some((s) => s.id === q.id),
    );

    // --- BƯỚC 3: BỐC THEO CHƯƠNG (CHỈ BỐC TRONG KHO CÂU THƯỜNG) ---
    for (const quota of chapterQuotas) {
      if (selected.length >= matrixProps.totalQuestions) break;

      const alreadyPickedInChapter = selected.filter(
        (q) => q.props.chapterId === quota.chapterId,
      ).length;
      const neededForChapter = quota.quantity - alreadyPickedInChapter;

      if (neededForChapter <= 0) continue;

      const remainingTotalNeeded = matrixProps.totalQuestions - selected.length;
      const actualTake = Math.min(neededForChapter, remainingTotalNeeded);

      // CHỈ LỌC TRONG nonCriticalPool
      const chapterPool = this._shuffle(
        nonCriticalPool.filter((q) => q.props.chapterId === quota.chapterId),
      );

      const canTakeFromPool = Math.min(actualTake, chapterPool.length);
      selected.push(...chapterPool.slice(0, canTakeFromPool));
    }

    // --- BƯỚC 4: BỐC BÙ (CŨNG CHỈ TRONG KHO CÂU THƯỜNG) ---
    const remainingNeeded = matrixProps.totalQuestions - selected.length;
    if (remainingNeeded > 0) {
      const leftoverPool = this._shuffle(
        nonCriticalPool.filter((q) => !selected.some((s) => s.id === q.id)),
      );

      if (leftoverPool.length < remainingNeeded) {
        throw new AppError(ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS);
      }

      selected.push(...leftoverPool.slice(0, remainingNeeded));
    }

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
