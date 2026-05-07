/**
 * @description Cấu trúc dữ Cấu trúc đề (Exam Matrix) trong Cache
 */
export interface ICachedExamMatrix {
  id: string;
  name: string;
  minCriticalQuestions: number;
  licenseCategoryName: string;
  licenseCategoryId: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  createdAt: Date;
}

