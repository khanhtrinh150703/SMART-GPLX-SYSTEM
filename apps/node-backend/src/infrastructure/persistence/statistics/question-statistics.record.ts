/**
 * @description Bản ghi lưu trữ thống kê câu hỏi trên toàn hệ thống (Persistence Layer).
 * Ánh xạ trực tiếp từ table 'question_statistics' trong Database.
 */
export interface IQuestionStatisticsRecord {
  readonly questionId: string;
  
  // --- ATTEMPT METRICS ---
  readonly totalAttempts: number;
  readonly correctCount: number;
  readonly wrongCount: number;
  readonly unansweredCount: number;

  // --- TIME METRICS ---
  readonly totalDurationSum: number;
  readonly averageDuration: number;

  // --- ANALYTICS ---
  readonly accuracyRate: number;
  readonly errorRate: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}