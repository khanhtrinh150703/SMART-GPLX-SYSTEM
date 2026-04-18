/**
 * @description Cấu trúc dữ liệu Prisma trả về (đã được Prisma tự động map sang camelCase)
 */
export interface IExamMatrixDetailRecord {
  id: string;
  examMatrixId: string; // Prisma tự map từ exam_matrix_id
  chapterId: string;    // Prisma tự map từ chapter_id
  percentage: number;
}

export interface IExamMatrixRecord {
  id: string;
  licenseCategoryId: string; // Prisma tự map từ license_category_id
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  deletedAt: Date | null;
  details?: IExamMatrixDetailRecord[]; 
}