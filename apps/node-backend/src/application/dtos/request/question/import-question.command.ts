// Dành riêng cho luồng Import (Dedicated to the Import flow)
export interface ImportQuestionCommand {
  chapterId: string;
  categoryId: string[];
  content: string;
  difficultyLevel: number;
  indexNumber: number;
  isCritical: boolean;
  imageLocalPath?: string;
  answers: {
    content: string;
    isCorrect: boolean;
    imageLocalPath?: string;
  }[];
}