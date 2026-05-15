/**
 * @description Bản ghi đầy đủ trong MySQL.
 */
export interface IExamHistorySummaryRecord {
  readonly id: string;
  readonly userId: string;
  readonly examName: string;
  readonly licenseCategoryId: string;
  readonly licenseCategoryName: string;
  readonly score: number;
  readonly totalQuestions: number;
  readonly isPassed: boolean;
  readonly duration: number; 
  readonly snapshotId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}

/**
 * @description Type dành riêng cho Update: Loại bỏ các trường bất biến.
 */
export type UpdateExamHistorySummaryRecord = Omit<
  IExamHistorySummaryRecord,
  "id" | "userId" | "createdAt"
>;
