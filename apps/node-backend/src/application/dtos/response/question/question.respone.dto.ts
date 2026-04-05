/**
 * @interface AnswerResponseDto
 * @description Dữ liệu đáp án trả về cho Client
 */
export interface AnswerResponseDto {
  id: string;
  content: string;
  isCorrect: boolean;
  imageUrl: string | null;
}

/**
 * @interface QuestionResponseDto
 * @description Dữ liệu câu hỏi trả về cho Client (Clean & Safe)
 */
export interface QuestionResponseDto {
  id: string;
  chapterId: string;
  content: string;
  imageUrl: string | null;
  isCritical: boolean;
  difficulty: {
    level: number; 
    label: string; 
  };
  answers: AnswerResponseDto[];
  licenseCategoryIds: string[];
}