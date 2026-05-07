// src/types/common.type.ts

export interface StandardResponse<T> {
  success: boolean;
  code: string;
  statusCode: number;
  message: string;
  data?: T; // <T> là phần lõi dữ liệu sẽ thay đổi tùy theo từng API           
}

export interface SelectionData {
  value: string; // Thường là ID (UUID)
  label: string; // Tên hiển thị trên giao diện (ví dụ: "A1", "B2")
  orderIndex?: number;
}

/**
 * Interface mở rộng cho việc lựa chọn Ma trận đề thi.
 * (Extended interface for Exam Matrix selection).
 */
export interface ISelectionExamMatrix extends SelectionData {
  /** Tên hạng bằng lái (ví dụ: "Hạng B2") - (License category name) */
  licenseCategoryName?: string;

  /** Tổng số câu hỏi trong ma trận này - (Total questions in this matrix) */
  totalQuestions?: number;

  /** Thời gian làm bài tính bằng phút - (Duration in minutes) */
  durationMinutes?: number;

  /** Có phải là ma trận mặc định của hạng bằng hay không - (Is it the default matrix) */
  isDefault?: boolean;

  licenseCategoryId: string;

  passingScore: number;

  createdAt: Date;

  minCriticalQuestions: number;
}