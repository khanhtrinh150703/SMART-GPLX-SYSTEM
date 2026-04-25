import { IExamSnapshot } from "@/domain/entities/exam-attempt/exam-attempt.props";

export interface IExamAttemptPersistence {
  readonly _id: string;     
  readonly userId: string;
  readonly examId: string;
  readonly score: number;
  readonly correctCount: number;
  readonly isPassed: boolean;
  readonly durationSeconds: number;
  readonly submittedAt: Date;
  readonly snapshot: IExamSnapshot;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}