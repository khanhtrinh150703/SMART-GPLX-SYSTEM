import { Prisma } from "@prisma/client";

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
  name: string;
  licenseCategoryId: string; // Prisma tự map từ license_category_id
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  isDefault: boolean;
  details: IExamMatrixDetailRecord[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Định nghĩa kiểu dữ liệu bao gồm cả quan hệ (include details)
export type ExamMatrixWithDetails = Prisma.ExamMatrixGetPayload<{
  include: { details: true }
}>;