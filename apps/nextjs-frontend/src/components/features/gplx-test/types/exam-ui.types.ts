// src/features/gplx-test/types/exam.types.ts

export type Difficulty = "easy" | "medium" | "hard";

/**
 * IExamItem: Cấu trúc dữ liệu bộ đề mở rộng.
 * Metadata (Dữ liệu mô tả), Progress (Tiến độ người dùng).
 */
export interface IExamItem {
  id: string;
  title: string;
  category: string;
  totalQuestions: number;
  duration: number; // minutes (phút)
  passingScore: number;
  limitMinutes: number;
  lastUpdated?: Date; 
  isHot?: boolean;
  description: string;
  difficulty?: Difficulty; // Độ khó
  completedCount: number; // Số lần đã làm
  highestScore?: number; // Điểm cao nhất đạt được
}

export interface IExamFilter {
  search: string;
  category: string;
}