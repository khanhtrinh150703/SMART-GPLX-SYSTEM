// domain/entities/question/question.props.ts

import { Answer } from "./answer.entity";
import { QuestionStatus } from "./question.status";

export interface IQuestionProps {
  id: string;
  chapterId: string;
  content: string;
  imageUrl: string;
  difficultyLevel: number;
  isCritical: boolean;
  answers: Answer[];
  licenseCategoryIds: string[];
  indexNumber: number;
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  
  chapterName?: string;
  licenseCategoryNames?: string[];
}

export type CreateQuestionProps = Omit<IQuestionProps, 
  | 'id' 
  | 'status' 
  | 'answers'
  | 'createdAt' 
  | 'updatedAt' 
  | 'deletedAt'
> & {
  answers: Array<{ content: string; isCorrect: boolean; imageUrl?: string }>;
  status?: string;
};