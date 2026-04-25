import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @description Snapshot của từng lựa chọn (đáp án) trong NoSQL
 */
export interface IAnswerSnapshot {
  readonly answerIndex: number; // 1, 2, 3...
  readonly content: string;
  readonly imageUrl?: string | null;
}

/**
 * @description Snapshot của từng câu hỏi tại thời điểm nộp bài
 */
export interface IQuestionSnapshot {
  readonly questionId: string;
  readonly indexNumber: number; // Số thứ tự câu hỏi trong đề (1-30, 1-40...)
  readonly content: string;
  readonly imageUrl: string;
  readonly isCritical: boolean;
  readonly chapterId: string;
  readonly chapterName: string;
  readonly options: IAnswerSnapshot[];
  readonly selectedAnswerIndex: number | null; // Index User chọn
  readonly correctAnswerIndex: number;          // Index đúng theo bảng ExamQuestion
  readonly isCorrect: boolean;
}

/**
 * @description Snapshot cấu trúc đề thi và metadata
 */
export interface IExamSnapshot {
  readonly title: string;
  readonly licenseCategory: string;
  readonly totalQuestions: number;
  readonly passingScore: number;
  readonly questions: IQuestionSnapshot[];
}

/**
 * @description Props chính cho ExamAttemptEntity (NoSQL)
 */
export interface IExamAttemptProps extends IBaseProps {
  readonly userId: string;
  readonly examId: string;
  readonly score: number;
  readonly correctCount: number;
  readonly isPassed: boolean;
  readonly durationSeconds: number;
  readonly submittedAt: Date;
  readonly snapshot: IExamSnapshot;
}

export type CreateExamAttemptProps = Omit<IExamAttemptProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;