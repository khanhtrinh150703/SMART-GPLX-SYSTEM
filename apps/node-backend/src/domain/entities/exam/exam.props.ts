import { ExamStatus } from "@prisma/client";

export interface IExamQuestionProps {
  questionId: string;
  indexNumber: number; // STT trong bộ 600 câu (để User tra cứu)
  
  // Dữ liệu Snapshot (để đảm bảo đề thi không đổi nếu kho câu hỏi thay đổi)
  isCritical: boolean;
  correctAnswer: number;
  
  // Metadata bổ sung (Optional - phục vụ hiển thị nhanh ở UI)
  chapterId?: string;
  chapterName?: string;
}

export interface IExamProps {
  id?: string; 
  name: string;
  userId: string;
  examMatrixId: string;
  licenseCategoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  
  // Snapshot Configuration (Thông tin đề thi tại thời điểm tạo)
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;

  // Trạng thái thực thi (Status & Kết quả)
  status: ExamStatus; // Lấy từ Prisma Enum
  score: number;
  isPassed: boolean;

  // Dấu mốc thời gian
  startedAt: Date;
  endedAt: Date | null;
  
  // Danh sách câu hỏi chi tiết
  questions: IExamQuestionProps[];
}

export type CreateExamProps = Omit<IExamProps, 
  | 'id' 
  | 'status' 
  | 'score' 
  | 'isPassed' 
  | 'startedAt' 
  | 'endedAt' 
  | 'createdAt' 
  | 'updatedAt' 
  | 'deletedAt'
>;