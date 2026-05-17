/**
 * @description Định nghĩa cấu trúc Record trong MySQL (Prisma).
 */
export interface IUserExamRankRecord {
  readonly id: string;
  readonly userId: string;
  readonly examId: string;
  readonly licenseCategoryId: string;
  readonly bestScore: number;
  readonly fastestSeconds: number;
  readonly lastAttemptId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}