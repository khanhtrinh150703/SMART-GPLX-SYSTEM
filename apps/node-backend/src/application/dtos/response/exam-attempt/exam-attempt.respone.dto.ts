
export interface IAnswerSnapshotResponseDTO {
  readonly answerIndex: number; // 1, 2, 3...
  readonly content: string;
  readonly imageUrl?: string | null;
}

export interface IQuestionSnapshotResponseDTO {
  readonly questionId: string;
  readonly indexNumber: number; // Số thứ tự câu hỏi trong đề (1-30, 1-40...)
  readonly content: string;
  readonly imageUrl: string;
  readonly isCritical: boolean;
  readonly chapterId: string;
  readonly chapterName: string;
  readonly options: IAnswerSnapshotResponseDTO[];
  readonly selectedAnswerIndex: number | null; // Index User chọn
  readonly correctAnswerIndex: number; // Index đúng theo bảng ExamQuestion
  readonly isCorrect: boolean;
  readonly explanation?: string;
}

/**
 * @interface IExamAttemptResponseDTO
 * @description DTO phản hồi đầy đủ kết quả lượt thi, bao gồm cả nội dung câu hỏi để Review.
 */
export interface IExamAttemptResponseDTO {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly examId: string;
  readonly examTitle: string;
  readonly licenseCategoryName: string;

  // Metrics
  readonly score: number;
  readonly correctCount: number;
  readonly wrongCount: number;
  readonly skippedCount: number;
  readonly totalQuestions: number;
  readonly passingScore: number;

  // Status
  readonly isPassed: boolean;
  readonly hasFailedCritical: boolean;

  // Time Analytics
  readonly durationSeconds: number;
  readonly durationFormatted?: string;
  readonly isAutoSubmit: boolean;
  readonly submittedAt: string;

  // Review Content (Dữ liệu từ Snapshot)
  readonly questions: IQuestionSnapshotResponseDTO[]; // <--- Mảnh ghép quan trọng cho History
}

export class ExamAttemptResponseDTO implements IExamAttemptResponseDTO {
  public readonly id: string;
  public readonly userId: string;
  public readonly userName: string;
  public readonly examId: string;
  public readonly examTitle: string;
  public readonly licenseCategoryName: string;
  public readonly score: number;
  public readonly correctCount: number;
  public readonly wrongCount: number;
  public readonly skippedCount: number;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly isPassed: boolean;
  public readonly hasFailedCritical: boolean;
  public readonly durationSeconds: number;
  public readonly durationFormatted?: string;
  public readonly isAutoSubmit: boolean;
  public readonly submittedAt: string;
  public readonly questions: IQuestionSnapshotResponseDTO[];

  constructor(data: IExamAttemptResponseDTO) {
    this.id = data.id;
    this.userId = data.userId;
    this.userName = data.userName;
    this.examId = data.examId;
    this.examTitle = data.examTitle;
    this.licenseCategoryName = data.licenseCategoryName;
    this.score = data.score;
    this.correctCount = data.correctCount;
    this.wrongCount = data.wrongCount;
    this.skippedCount = data.skippedCount;
    this.totalQuestions = data.totalQuestions;
    this.passingScore = data.passingScore;
    this.isPassed = data.isPassed;
    this.hasFailedCritical = data.hasFailedCritical;
    this.durationSeconds = data.durationSeconds;
    this.durationFormatted = this._formatDuration(data.durationSeconds);
    this.isAutoSubmit = data.isAutoSubmit;
    this.submittedAt = data.submittedAt;
    
    // Gán danh sách câu hỏi từ snapshot vào để FE render trang Review
    this.questions = data.questions || [];
  }

  private _formatDuration(seconds: number): string {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }
}