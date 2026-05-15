/**
 * @description Giao diện dữ liệu trả về cho một mục lịch sử thi trong danh sách.
 */
export interface IExamHistorySummaryResponseDTO {
  readonly examName: string;
  readonly licenseCategoryName: string;
  readonly score: number;
  readonly totalQuestions: number;
  readonly isPassed: boolean;
  readonly snapshotId: string;
  readonly createdAt: Date;
  readonly durationSeconds: number;
}

/**
 * @description DTO vận chuyển thông tin một bản ghi lịch sử thi.
 */
export class ExamHistorySummaryResponseDTO implements IExamHistorySummaryResponseDTO {
  public readonly examName: string;
  public readonly licenseCategoryName: string;
  public readonly score: number;
  public readonly totalQuestions: number;
  public readonly isPassed: boolean;
  public readonly createdAt: Date;
  public readonly durationSeconds: number;
  public readonly snapshotId: string;
  constructor(data: IExamHistorySummaryResponseDTO) {
    this.examName = data.examName;
    this.licenseCategoryName = data.licenseCategoryName;
    this.score = data.score;
    this.totalQuestions = data.totalQuestions;
    this.isPassed = data.isPassed;
    this.createdAt = data.createdAt;
    this.durationSeconds = data.durationSeconds;
    this.snapshotId = data.snapshotId;
  }
}
