/**
 * @description Chi tiết từng phương án trả lời (Answer Option).
 */
export interface IExamUserAnswerResponseDTO {
  readonly position: number;  // Thứ tự (1, 2, 3...)
  readonly content: string;   // Nội dung đáp án
  readonly imageUrl: string | null; // Đường dẫn hình ảnh (nếu có)
}

/**
 * @description Chi tiết từng câu hỏi trong bản xem lại (Review Question).
 */
export interface IExamUserQuestionResponseDTO {
  readonly questionId: string;
  readonly indexNumber: number;
  readonly content: string;
  readonly imageUrl: string | null;
  readonly isCritical: boolean; // Câu hỏi điểm liệt (Critical Question)
  readonly chapterName?: string;
  readonly userSelectedAnswer?: number; // Đáp án người dùng chọn
  readonly correctAnswer?: number;       // Đáp án đúng thực tế
  readonly answers: IExamUserAnswerResponseDTO[];
}

/**
 * @description Dữ liệu kết quả thi đầy đủ cho FE (Full Exam Result Response).
 */
export interface IExamUserResultResponseDTO {
  // 1. Thông tin định danh (Identity)
  readonly examId: string;
  readonly title: string;
  readonly licenseCategoryName?: string;

  // 2. Kết quả chấm điểm (Grading Results)
  readonly score: number;             // Điểm đạt được
  readonly passed: boolean;            // Trạng thái Đỗ/Trượt
  readonly totalQuestions: number;
  readonly correctAnswers: number;     // Số câu đúng
  readonly wrongAnswers: number;       // Số câu sai
  readonly skippedAnswers: number;     // Số câu bỏ trống
  readonly isFailedByCritical: boolean; // Trượt do sai câu điểm liệt

  // 3. Metadata thời gian (Time Analytics)
  readonly timeSpent: number;         // Thời gian làm bài (giây)
  readonly timeRemaining: number;     // Thời gian còn lại (giây)
  readonly timeExam: number;     // Thời gian còn lại (giây)
  readonly isAutoSubmit: boolean;     // Tự động nộp bài
  readonly clientFinishedAt: string;  // Thời điểm kết thúc (ISO)

  // 4. Danh sách câu hỏi để xem lại (Review List)
  readonly questions: IExamUserQuestionResponseDTO[];
}