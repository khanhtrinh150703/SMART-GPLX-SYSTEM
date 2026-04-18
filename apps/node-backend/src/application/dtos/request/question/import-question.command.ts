// Dành riêng cho luồng Import (Dedicated to the Import flow)
export interface ImportQuestionCommand {
  chapterId: string;
  categoryId: string[];
  content: string;
  difficultyLevel: number;
  isCritical: boolean;
  imageLocalPath?: string; // Chỉ dùng đường dẫn Local
  answers: {
    content: string;
    isCorrect: boolean;
    imageLocalPath?: string;
  }[];
}