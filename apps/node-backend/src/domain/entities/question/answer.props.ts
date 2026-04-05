export interface AnswerProps {
  id?: string;
  content: string;
  imageUrl?: string | null;
  isCorrect: boolean;
  deletedAt: Date | null;
}