/**
 * @description Cấu trúc đóng băng của câu hỏi để lưu vào NoSQL.
 */
export interface IQuestionSnapshot {
  readonly questionId: string;
  readonly indexNumber: number; // STT trong đề thi cụ thể
  readonly content: string;
  readonly imageUrl: string;
  readonly isCritical: boolean;
  readonly chapterId: string;
  readonly chapterName?: string;
  readonly options: IAnswerSnapshot[];
  readonly selectedAnswerId: string | null;
  readonly correctAnswerId: string;
  readonly isCorrect: boolean;
}

export interface IAnswerSnapshot {
  readonly answerId: string;
  readonly content: string;
  readonly imageUrl?: string | null;
}