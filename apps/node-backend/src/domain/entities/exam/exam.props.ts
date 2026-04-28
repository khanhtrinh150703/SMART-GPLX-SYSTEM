import { ExamStatus } from "@prisma/client";

export interface IExamQuestionProps {
  questionId: string;
  indexNumber: number; // STT trong bộ 600 câu (để User tra cứu)

  // Dữ liệu Snapshot (để đảm bảo đề thi không đổi nếu kho câu hỏi thay đổi)
  isCritical: boolean;
  correctAnswer: number;

  // Metadata bổ sung (Optional - phục vụ hiển thị nhanh ở UI)
  chapterId?: string;
  chapterName?: string;
}

export interface IExamProps {
  id: string;
  name: string;
  userId: string;

  // 1. CHỈNH SỬA: examMatrixId trong Prisma là String?, nên ở đây phải có ?
  examMatrixId?: string | null;

  licenseCategoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;

  status: ExamStatus;
  score: number;
  isPassed: boolean;

  startedAt: Date;
  endedAt: Date | null;

  questions: IExamQuestionProps[];
  userName?: string;
  licenseCategoryName?: string;
}

export type CreateExamProps = Omit<IExamProps,
  | 'id'
  | 'score'
  | 'isPassed'
  | 'startedAt'
  | 'endedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;