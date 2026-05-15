export interface IAnswerSnapshotResponseDTO {
  readonly position: number; 
  readonly content: string;
  readonly imageUrl?: string | null;
}

export interface IQuestionSnapshotResponseDTO {
  readonly questionId: string;
  readonly indexNumber: number;
  readonly content: string;
  readonly imageUrl: string;
  readonly isCritical: boolean;
  readonly chapterId: string;
  readonly chapterName: string;
  readonly timeSpent: number;
  readonly userSelectedAnswer: number | null; 
  readonly correctAnswer: number;            
  
  readonly isCorrect: boolean;
  readonly explanation?: string;
  readonly answers: IAnswerSnapshotResponseDTO[]; // options -> answers
}

/**
 * @interface IExamAttemptResponseDTO
 * @description DTO phản hồi lịch sử thi, đã đồng bộ tên chuẩn với Result DTO.
 */
export interface IExamAttemptResponseDTO {
  // 1. Thông tin định danh & User
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly examId: string;
  readonly title: string; // Tên đề thi
  readonly licenseCategoryName?: string;

  // 2. Kết quả chấm điểm (Core Results)
  readonly score: number;
  readonly totalQuestions: number;
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly skippedAnswers: number;
  readonly passed: boolean;
  readonly hasFailedCritical: boolean;
  readonly passingScore: number;

  // 3. Phân tích thời gian (Time Analytics - Đồng bộ tên chuẩn)
  readonly timeSpent: number; // durationSeconds -> timeSpent
  readonly timeExam: number; 
  readonly isAutoSubmit: boolean;
  readonly clientFinishedAt: string; // submittedAt -> clientFinishedAt

  // 4. Nội dung bài làm để xem lại (Review)
  readonly questions: IQuestionSnapshotResponseDTO[];
}

export class ExamAttemptResponseDTO implements IExamAttemptResponseDTO {
  public readonly id: string;
  public readonly userId: string;
  public readonly userName: string;
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
  public readonly isAutoSubmit: boolean;
  public readonly clientFinishedAt: string;
  public readonly durationFormatted: string; // Giữ lại helper cho FE nếu cần
  public readonly questions: IQuestionSnapshotResponseDTO[];

  constructor(data: IExamAttemptResponseDTO) {
    this.id = data.id;
    this.userId = data.userId;
    this.userName = data.userName;
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

    this.timeSpent = data.timeSpent;
    this.timeExam = data.timeExam ?? 0;
    this.isAutoSubmit = data.isAutoSubmit;
    this.clientFinishedAt = data.clientFinishedAt;
    this.durationFormatted = this._formatDuration(data.timeSpent);

    this.questions = data.questions || [];
  }

  private _formatDuration(seconds: number): string {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }
}
