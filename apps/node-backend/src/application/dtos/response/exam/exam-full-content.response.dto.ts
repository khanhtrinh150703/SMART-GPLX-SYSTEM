/**
 * @description DTO phản hồi cho từng lựa chọn đáp án dành cho người dùng.
 */
export interface IExamUserAnswerResponseDTO {
  readonly position: number;  // 1, 2, 3, 4... dùng để user chọn
  readonly content: string;
  readonly imageUrl: string | null;
}

/**
 * @description DTO phản hồi dữ liệu câu hỏi chi tiết trong bài thi cho người dùng.
 */
export interface IExamUserQuestionResponseDTO {
  readonly questionId: string;
  readonly indexNumber: number;
  readonly content: string;
  readonly imageUrl: string | null;
  readonly isCritical: boolean;
  readonly userSelectedAnswer?: number; // Đáp án User đã chọn (1, 2, 3...)
  readonly correctAnswer?: number;     // Đáp án đúng để FE đối chiếu
  readonly answers: IExamUserAnswerResponseDTO[];
  readonly chapterName?: string;
}

export class ExamUserQuestionResponseDTO implements IExamUserQuestionResponseDTO {
  public readonly questionId: string;
  public readonly indexNumber: number;
  public readonly content: string;
  public readonly imageUrl: string | null;
  public readonly isCritical: boolean;
  public readonly userSelectedAnswer?: number;
  public readonly correctAnswer?: number;
  public readonly answers: IExamUserAnswerResponseDTO[];
  public readonly chapterName?: string;

  constructor(data: IExamUserQuestionResponseDTO) {
    this.questionId = data.questionId;
    this.indexNumber = data.indexNumber;
    this.content = data.content;
    this.imageUrl = data.imageUrl ?? "";
    this.isCritical = data.isCritical;
    this.answers = data.answers || [];
    this.userSelectedAnswer = data.userSelectedAnswer;
    this.correctAnswer = data.correctAnswer;
    this.chapterName = data.chapterName;
  }
}

/**
 * @description DTO phản hồi toàn bộ nội dung bài thi dành cho người dùng.
 */
export interface IExamUserFullContentResponseDTO {
  readonly examId: string;
  readonly title: string;
  readonly limitMinutes: number;
  readonly totalQuestions: number;
  readonly licenseCategoryName?: string;
  readonly questions: IExamUserQuestionResponseDTO[];
}

export class ExamUserFullContentResponseDTO implements IExamUserFullContentResponseDTO {
  public readonly examId: string;
  public readonly title: string;
  public readonly limitMinutes: number;
  public readonly totalQuestions: number;
  readonly licenseCategoryName?: string;
  public readonly questions: IExamUserQuestionResponseDTO[];

  constructor(data: IExamUserFullContentResponseDTO) {
    this.examId = data.examId;
    this.title = data.title;
    this.limitMinutes = data.limitMinutes;
    this.totalQuestions = data.totalQuestions;
    this.licenseCategoryName = data.licenseCategoryName;
    this.questions = data.questions || [];
  }
}