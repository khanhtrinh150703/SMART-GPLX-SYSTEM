import { ExamStatus } from "./enums";

// Phản hồi cho từng câu hỏi trong đề thi (Response for each exam question)
export interface IExamQuestionResponse {
  questionId: string;
  indexNumber: number; // Số thứ tự câu hỏi
  chapterId?: string;
  chapterName?: string;
  isCritical: boolean; // Câu hỏi điểm liệt
  correctAnswer?: number;
}

// Phản hồi tổng thể của bài thi (Overall exam response)
export interface IExamResponse {
  id: string;
  name: string;
  userId: string;
  licenseCategoryId: string;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: Date;
  userName?: string;
  licenseCategoryName?: string;
  status: ExamStatus;
  questions: IExamQuestionResponse[];
}

// Dữ liệu truyền lên để sinh đề (Data Transfer Object for generating exam)
export interface IGenerateExamDTO {
  matrixId: string;
  name: string;
}