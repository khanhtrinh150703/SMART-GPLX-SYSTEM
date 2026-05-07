import { ExamStatus } from "@prisma/client";

/**
 * @description Giao diện dữ liệu trả về cho từng câu hỏi trong đề thi.
 */
export interface IExamQuestionResponseDTO {
  readonly questionId: string;
  readonly indexNumber: number;
  readonly chapterId?: string;
  readonly chapterName?: string;
  readonly isCritical: boolean;
  readonly correctAnswer?: number;
}

/**
 * @description DTO vận chuyển thông tin câu hỏi trong đề thi.
 */
export class ExamQuestionResponseDTO implements IExamQuestionResponseDTO {
  public readonly questionId: string;
  public readonly indexNumber: number;
  public readonly chapterId?: string;
  public readonly chapterName?: string;
  public readonly isCritical: boolean;
  public readonly correctAnswer?: number;

  constructor(data: IExamQuestionResponseDTO) {
    this.questionId = data.questionId;
    this.indexNumber = data.indexNumber;
    this.chapterId = data.chapterId;
    this.chapterName = data.chapterName;
    this.isCritical = data.isCritical;
    this.correctAnswer = data.correctAnswer;
  }
}

/**
 * @description Giao diện dữ liệu trả về cho thông tin chi tiết một đề thi.
 */
export interface IExamResponseDTO {
  readonly id: string;
  readonly name: string;
  readonly userId: string;
  readonly licenseCategoryId: string;
  readonly totalQuestions: number;
  readonly durationMinutes: number;
  readonly passingScore: number;
  readonly minCriticalQuestions: number;
  readonly startedAt: Date;
  readonly createdAt: Date;
  readonly userName?: string;
  readonly licenseCategoryName?: string;
  readonly status: ExamStatus;
  readonly questions: IExamQuestionResponseDTO[];
}

/**
 * @description DTO vận chuyển thông tin đề thi hoàn chỉnh.
 * Đóng vai trò mang dữ liệu sạch để phản hồi cho phía Client trong dự án Smart-GPLX-System.
 */
export class ExamResponseDTO implements IExamResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly userId: string;
  public readonly licenseCategoryId: string;
  public readonly totalQuestions: number;
  public readonly durationMinutes: number;
  public readonly passingScore: number;
  public readonly minCriticalQuestions: number;
  public readonly startedAt: Date;
  public readonly createdAt: Date;
  public readonly userName?: string;
  public readonly licenseCategoryName?: string;
  public readonly status: ExamStatus;
  public readonly questions: IExamQuestionResponseDTO[];

  constructor(data: IExamResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.licenseCategoryId = data.licenseCategoryId;
    this.totalQuestions = data.totalQuestions;
    this.durationMinutes = data.durationMinutes;
    this.passingScore = data.passingScore;
    this.minCriticalQuestions = data.minCriticalQuestions;
    this.startedAt = data.startedAt;
    this.createdAt = data.createdAt;
    this.userName = data.userName;
    this.licenseCategoryName = data.licenseCategoryName;
    this.status = data.status;
    this.questions = data.questions.map(q => new ExamQuestionResponseDTO(q));
  }
}