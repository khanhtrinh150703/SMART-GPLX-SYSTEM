import { ExamStatus } from "./enums";

export interface ICreateManualExamDTO {
  // 1. Thông tin cơ bản
  name: string; // Tên đề thi
  licenseCategoryId: string; // ID hạng bằng lái (A1, B2...)

  // examMatrixId có thể null nên để optional (?)
  examMatrixId?: string | null; // ID ma trận đề (nếu có)
  isEdited?: boolean;
  isChapter?: boolean;
  status: ExamStatus;

  // 2. Cấu hình Snapshot (Bắt buộc để chốt quy tắc tại thời điểm tạo)
  totalQuestions: number; // Tổng số câu hỏi
  passingScore: number; // Điểm đạt
  durationMinutes: number; // Thời gian làm bài
  minCriticalQuestions: number; // Số câu điểm liệt tối thiểu cần đúng

  // 3. Danh sách câu hỏi được chỉ định
  questionIds: string[]; // Mảng ID các câu hỏi đã chọn
}

// Phản hồi tổng thể của bài thi (Overall exam response)
export interface IExamResponse {
  id: string;
  name: string;
  userId: string;
  licenseCategoryId: string;
  totalQuestions: number;
  passingScore: number;
  minCriticalQuestions: number; // Số câu điểm liệt tối thiểu cần đúng
  examMatrixId?: string | null;
  isEdited?: boolean | false;
  isChapter?: boolean;
  durationMinutes: number;
  startedAt: Date;
  fullName?: string;
  licenseCategoryName?: string;
  status: ExamStatus;
  questions: IExamQuestionResponse[];
}

// Phản hồi cho từng câu hỏi trong đề thi (Response for each exam question)
export interface IExamQuestionResponse {
  questionId: string;
  indexNumber: number; // Số thứ tự câu hỏi
  chapterId?: string;
  chapterName?: string;
  isCritical: boolean; // Câu hỏi điểm liệt
  correctAnswer?: number;
}
