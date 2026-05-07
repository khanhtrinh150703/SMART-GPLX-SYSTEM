// src/features/gplx-test/types/exam-session.types.ts

/**
 * Lựa chọn đáp án
 */
export interface IExamOption {
  readonly position: number;
  readonly content: string;
  readonly imageUrl?: string | null;
}

/**
 * Chi tiết câu hỏi trong bài thi
 */
export interface IExamQuestion {
  readonly questionId: string;
  readonly indexNumber: number;       // Thứ tự hiển thị 1, 2, 3...
  readonly content: string;     // Nội dung câu hỏi
  readonly imageUrl?: string | null;
  readonly isCritical: boolean; // Câu hỏi điểm liệt
  readonly answers: IExamOption[];
  readonly chapterName: string;
  // Lưu ý: Field này chỉ nên ó khi ở chế độ "Luyện tập" hoặc "Xem lại bài"
  readonly correctOptionId?: number;
}

/**
 * Tổng thể bài thi hoàn chỉnh
 */
export interface IExamFullContent {
  readonly examId: string;
  readonly title: string;
  readonly limitMinutes: number;
  readonly totalQuestions: number;
  readonly licenseCategoryName: string;
  readonly questions: IExamQuestion[];
}
