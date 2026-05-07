/**
 * @description DTO phản hồi danh sách tóm tắt các bộ đề thi.
 */
export interface IExamSummaryResponseDTO {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly totalQuestions: number;
  readonly passScore: number;
  readonly limitMinutes: number;
}

export class ExamSummaryResponseDTO implements IExamSummaryResponseDTO {
  public readonly id: string;
  public readonly title: string;
  public readonly category: string;
  public readonly totalQuestions: number;
  public readonly passScore: number;
  public readonly limitMinutes: number;

  constructor(data: IExamSummaryResponseDTO) {
    this.id = data.id;
    this.title = data.title;
    this.category = data.category;
    this.totalQuestions = data.totalQuestions;
    this.passScore = data.passScore;
    this.limitMinutes = data.limitMinutes;
  }
}