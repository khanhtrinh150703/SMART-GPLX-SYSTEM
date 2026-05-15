import { IExamUserQuestionResponseDTO } from "./exam-full-content.response.dto";

/**
 * @description DTO phản hồi chi tiết kết quả bài thi, bao gồm điểm số và phân tích thời gian.
 */
export interface IExamUserResultResponseDTO {
  // 1. Thông tin định danh đề thi
  readonly examId: string;
  readonly title: string;
  readonly licenseCategoryName?: string;

  // 2. Kết quả chấm điểm (Core Results)
  readonly score: number; // Điểm số cuối cùng
  readonly totalQuestions: number; // Tổng số câu trong đề
  readonly correctAnswers: number; // Số câu trả lời đúng
  readonly wrongAnswers: number; // Số câu trả lời sai
  readonly skippedAnswers: number; // Số câu bỏ trống
  readonly passed: boolean; // Trạng thái Đạt hay Không đạt
  readonly hasFailedCritical: boolean;
  readonly passingScore: number;
  readonly timeExam: number;

  // 3. Phân tích thời gian (Time Analytics) - Yêu cầu của bạn
  readonly timeSpent: number; // Tổng thời gian làm bài (giây)
  readonly timeRemaining: number; // Thời gian còn lại khi nộp (giây)
  readonly isAutoSubmit: boolean; // Hệ thống nộp hộ hay User tự nộp
  readonly clientFinishedAt: string; // Thời điểm kết thúc (ISO format)

  // 4. Nội dung bài làm để xem lại (Review)
  readonly questions: IExamUserQuestionResponseDTO[];
}

export class ExamUserResultResponseDTO implements IExamUserResultResponseDTO {
  public readonly examId: string;
  public readonly title: string;
  public readonly licenseCategoryName?: string;

  public readonly score: number;
  public readonly totalQuestions: number;
  public readonly correctAnswers: number;
  public readonly wrongAnswers: number;
  public readonly skippedAnswers: number;
  public readonly passed: boolean;
  public readonly hasFailedCritical: boolean;
  public readonly passingScore: number;

  public readonly timeSpent: number;
  public readonly timeExam: number;
  public readonly timeRemaining: number;
  public readonly isAutoSubmit: boolean;
  public readonly clientFinishedAt: string;
  public readonly questions: IExamUserQuestionResponseDTO[];

  constructor(data: IExamUserResultResponseDTO) {
    this.examId = data.examId;
    this.title = data.title;
    this.licenseCategoryName = data.licenseCategoryName;

    this.score = data.score;
    this.totalQuestions = data.totalQuestions;
    this.correctAnswers = data.correctAnswers;
    this.wrongAnswers = data.wrongAnswers;
    this.skippedAnswers = data.skippedAnswers;
    this.passed = data.passed;
    this.hasFailedCritical = data.hasFailedCritical;
    this.passingScore = data.passingScore;
    this.timeExam = data.timeExam;
    
    this.timeSpent = data.timeSpent;
    this.timeRemaining = data.timeRemaining;
    this.isAutoSubmit = data.isAutoSubmit;
    this.clientFinishedAt = data.clientFinishedAt;
    this.questions = data.questions || [];
  }
}
