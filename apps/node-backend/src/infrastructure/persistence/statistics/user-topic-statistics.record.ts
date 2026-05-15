/**
 * @description Bản ghi lưu trữ thống kê chủ đề của người dùng (Persistence Layer).
 * Ánh xạ trực tiếp từ table 'user_topic_statistics' trong Database.
 */
export interface IUserTopicStatisticsRecord {
  readonly id: string;
  readonly userId: string;
  readonly topicId: string;
  readonly topicName: string;

  // --- QUESTION METRICS ---
  readonly totalQuestions: number;
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly unanswered: number;
  readonly questionsAttempted: number;
  
  // --- TIME METRICS ---
  readonly totalDurationSum: number;
  readonly averageDuration: number;

  // --- ANALYTICS ---
  readonly accuracyRate: number;
  readonly errorRate: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}