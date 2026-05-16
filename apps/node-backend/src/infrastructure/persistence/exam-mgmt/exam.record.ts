import { Status } from "@/shared/config/status.config";
import { Prisma } from "@prisma/client";

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
  status: Status;
  isChapter: boolean;
  score: number;
  isPassed: boolean;
  startedAt: Date;
  endedAt: Date | null;
  questions?: IExamQuestionRecord[];
}

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
    include: {
      question: {
        include: {
          answers: true,
          chapter: true  
        }
      }
    },
    // Truy cập sâu: ExamQuestion -> Question -> Chapter -> orderIndex
    orderBy: {
      question: {
        chapter: {
          orderIndex: 'asc' // Sắp xếp tăng dần theo chương
        }
      }
    }
  },
} as const;

export type PrismaExamWithRelations = Prisma.ExamGetPayload<{
  include: typeof examInclude
}>;