import { ExamStatus, Prisma } from "@prisma/client";

/**
 * @description Type hỗ trợ lấy dữ liệu từ Prisma kèm quan hệ Questions.
 */
export type ExamWithQuestions = Prisma.ExamGetPayload<{
  include: { questions: true }
}>;

export interface IExamQuestionRecord {
  examId: string;
  questionId: string;
  correctAnswer: number;
  isCritical: boolean;
  order: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

export interface IExamRecord {
  id: string;
  userId: string;
  examMatrixId: string;
  licenseCategoryId: string;
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  status: ExamStatus;
  score: number;
  isPassed: boolean;
  startedAt: Date;
  endedAt: Date | null;
  questions?: IExamQuestionRecord[];
}

export type PrismaExamWithRelations = Prisma.ExamGetPayload<{
  include: typeof examInclude
}>;

export const examInclude = {
  user: {
    select: {
      fullName: true,
      email: true
    }
  },
  licenseCategory: {
    select: {
      name: true,
    }
  },
  questions: {
    orderBy: {
      indexNumber: 'asc'
    }
  },
} as const;;
