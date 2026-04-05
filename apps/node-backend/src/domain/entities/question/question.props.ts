import { AnswerProps } from "./answer.props";
/**
 * @description Định nghĩa các thuộc tính của đối tượng Câu hỏi (Question)
 */
export interface QuestionProps {
  id?: string;
  chapterId: string;
  content: string;
  imageUrl?: string | null;
  difficultyLevel: number;
  isCritical: boolean;
  answers: AnswerProps[];
  licenseCategoryIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
}