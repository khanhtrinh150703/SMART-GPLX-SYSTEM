/**
 * @description Interface định nghĩa dữ liệu trả về cho thông tin thống kê theo chủ đề.
 * Giúp Client nắm bắt được người dùng đang yếu ở phần nào (ví dụ: Biển báo, Sa hình...).
 */
export interface IUserTopicStatisticsResponseDTO {
  readonly topicId: string;
  readonly topicName: string;

  // --- Tiến độ (Dùng cho thanh Progress Bar) ---
  readonly totalQuestions: number; // Tổng câu trong kho (Mẫu số)
  readonly questionsAttempted: number; // Số câu đã từng làm (Tử số)

  // --- Kết quả (Dùng cho biểu đồ tròn) ---
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly unanswered: number;
  readonly accuracyRate: number; // Tỷ lệ đúng (%)
  readonly errorRate: number; // Tỷ lệ lỗi (%)

  // --- Thời gian (Dùng cho chỉ số tốc độ) ---
  readonly averageDuration: number; // Thời gian trung bình mỗi câu (giây)

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}

/**
 * @description DTO vận chuyển thông tin thống kê chủ đề của người dùng.
 * Ẩn đi các trường nhạy cảm như deletedAt và đảm bảo tính bất biến.
 */
export class UserTopicStatisticsResponseDTO implements IUserTopicStatisticsResponseDTO {
  public readonly topicId: string;
  public readonly topicName: string;
  public readonly totalQuestions: number;
  public readonly questionsAttempted: number;
  public readonly correctAnswers: number;
  public readonly wrongAnswers: number;
  public readonly unanswered: number;
  public readonly accuracyRate: number;
  public readonly errorRate: number;
  public readonly averageDuration: number;
  public readonly createdAt: Date | string;
  public readonly updatedAt: Date | string;

  constructor(data: IUserTopicStatisticsResponseDTO) {
    this.topicId = data.topicId;
    this.topicName = data.topicName;
    this.totalQuestions = data.totalQuestions;
    this.questionsAttempted = data.questionsAttempted;
    this.correctAnswers = data.correctAnswers;
    this.wrongAnswers = data.wrongAnswers;
    this.unanswered = data.unanswered;
    this.accuracyRate = data.accuracyRate;
    this.errorRate = data.errorRate;
    this.averageDuration = data.averageDuration;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public static create(
    data: IUserTopicStatisticsResponseDTO,
  ): UserTopicStatisticsResponseDTO {
    return new UserTopicStatisticsResponseDTO(data);
  }
}
