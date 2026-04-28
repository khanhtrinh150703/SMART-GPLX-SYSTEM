import { ExamStatus } from "@prisma/client";

export interface IExamQuestionResponse {
  questionId: string;
  indexNumber: number;
  chapterId?: string;
  chapterName?: string;
  isCritical: boolean;
  correctAnswer?: number;
}

export interface IExamResponse {
  id: string;
  name: string;
  userId: string;
  licenseCategoryId: string;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: Date;
  userName?: string;
  licenseCategoryName?: string;
  // endedAt: Date | null;
  status: ExamStatus;
  questions: IExamQuestionResponse[];
}