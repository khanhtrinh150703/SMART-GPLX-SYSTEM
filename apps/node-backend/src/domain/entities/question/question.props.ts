// domain/entities/question/question.props.ts

import { AnswerProps } from "./answer.props";
import { QuestionStatus } from "./question.status";

export interface QuestionProps {
  id?: string;
  chapterId: string;
  content: string;
  imageUrl?: string | null;
  difficultyLevel: number;
  isCritical: boolean;
  answers: AnswerProps[];
  licenseCategoryIds: string[];
  
  status: QuestionStatus
  // --- BỔ SUNG CÁC TRƯỜNG DÀNH CHO HIỂN THỊ (ENRICHED DATA) ---
  /** @description Tên chương học (Dịch: Name of the chapter) */
  chapterName?: string;

  /** @description Danh sách tên các hạng bằng lái (Dịch: Names of the license categories) */
  licenseCategoryNames?: string[];
  // ----------------------------------------------------------

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
}