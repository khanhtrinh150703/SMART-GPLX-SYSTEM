/**
 * @description DTO yêu cầu đồng bộ kỷ lục.
 * Bắt buộc có hậu tố "Request" theo tiêu chuẩn của Trinh.
 */
export interface SyncRankRequestDTO {
  readonly userId: string;
  readonly examId: string;
  readonly licenseCategoryId: string;
  readonly score: number;
  readonly durationSeconds: number;
  readonly attemptId: string;
}