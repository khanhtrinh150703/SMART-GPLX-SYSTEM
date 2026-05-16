import { IBaseProps } from "@/domain/seedwork/entity.base";

export interface IExamHistorySummaryProps extends IBaseProps  {
  id?: string;
  userId: string;
  examName: string;
  licenseCategoryId: string;
  licenseCategoryName: string;
  score: number;
  totalQuestions: number;
  isPassed: boolean;
  durationSeconds: number;
  snapshotId: string; // ID tham chiếu sang NoSQL (MongoDB)
}

/**
 * @description Type dùng để tạo lịch sử thi mới sau khi nộp bài.
 */
export type CreateExamHistorySummaryProps = Omit<IExamHistorySummaryProps,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;