// src/features/gplx-test/types/exam-submission.types.ts

/** 
 * @description Dữ liệu đáp án người dùng chọn cho từng câu hỏi 
 * (Individual answer data)
 */
export interface IExamAnswerItem {
  readonly questionId: string;
  readonly answer: number; // Index của đáp án đã chọn
}

/** 
 * @description Payload nộp bài thi gửi lên API 
 * (Final payload for exam submission)
 */
export interface ICompleteExamRequestDTO {
  readonly examId: string;
  readonly answers: IExamAnswerItem[];
  readonly timeSpent: number;      // Thời gian đã làm (giây)
  readonly timeRemaining: number;  // Thời gian còn lại (giây)
  readonly isAutoSubmit: boolean;  // Tự động nộp do hết giờ?
  readonly clientFinishedAt: string; // Thời điểm hoàn thành tại client (ISO string)
}