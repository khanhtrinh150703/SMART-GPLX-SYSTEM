import { ExamStatus } from "@prisma/client";
import { Question } from "../question/question.entity";

/**
 * @description Dữ liệu Snapshot của từng lựa chọn đáp án.
 * Chỉ chứa thông tin hiển thị, không chứa logic nghiệp vụ.
 */
export interface IAnswerSnapshotProps {
  readonly content: string;
  readonly imageUrl?: string;
}

/**
 * @description Dữ liệu Snapshot nội dung câu hỏi đi kèm bài thi.
 * Được tách ra để đảm bảo tính đóng gói và dễ quản lý.
 */
export interface IQuestionSnapshotProps {
  readonly content: string;
  readonly imageUrl?: string;
  readonly answers: IAnswerSnapshotProps[];
}

/**
 * @description Interface chính quản lý quan hệ giữa bài thi và câu hỏi.
 */
export interface IExamQuestionProps {
  readonly questionId: string;
  readonly indexNumber: number; // STT trong bộ 600 câu (để User tra cứu)

  // Dữ liệu Snapshot (Bảo toàn đề thi khi kho câu hỏi thay đổi)
  readonly isCritical: boolean;
  readonly correctAnswer: number;
  readonly userAnswer?: number;
  readonly isCorrect?: boolean;
  // Metadata bổ sung
  readonly chapterId?: string;
  readonly chapterName?: string;

  // Sử dụng Interface vừa tách
  readonly question?: IQuestionSnapshotProps;
}

export interface IExamResultMetadata {
  readonly timeSpent: number;
  readonly timeRemaining: number;
  readonly isAutoSubmit: boolean;
  readonly clientFinishedAt: Date;
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

  resultMetadata?: IExamResultMetadata;
  userName?: string;
  hasFailedCritical?: boolean;
  licenseCategoryName?: string;
  wrongCount?: number;
  skippedCount?: number;
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
  | 'questions'
>;
export type CreateExamInput = CreateExamProps & {
  rawQuestions: Question[];
};