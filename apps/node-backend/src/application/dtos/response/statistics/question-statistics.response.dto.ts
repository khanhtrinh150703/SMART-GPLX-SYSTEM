/**
 * @description Interface định nghĩa dữ liệu thống kê độ khó của câu hỏi.
 * Thường dùng để xác định các câu hỏi "liệt" hoặc câu hỏi hay bị nhầm lẫn.
 */
/**
 * @description Interface định nghĩa dữ liệu thống kê độ khó của câu hỏi toàn hệ thống.
 * Giúp AI xác định các câu hỏi "điểm liệt" hoặc các câu hỏi cần nhiều thời gian suy nghĩ.
 */
export interface IQuestionStatisticsResponseDTO {
  readonly totalAttempts: number;      // Tổng số lượt làm câu này (tính cả lặp lại)
  readonly correctCount: number;       // Số lượt trả lời đúng
  readonly wrongCount: number;         // Số lượt trả lời sai
  readonly errorRate: number;          // Tỷ lệ lỗi (%)
  
  // Chỉ số thời gian (Cực kỳ quan trọng để đánh giá độ khó thực tế)
  readonly averageDuration: number;    // Thời gian trung bình để xử lý câu này (giây)

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}

/**
 * @description DTO vận chuyển thông tin thống kê câu hỏi.
 * Đảm bảo tính nhất quán giữa lớp Persistence và dữ liệu trả về cho Client.
 */
/**
 * @description DTO vận chuyển thông tin thống kê câu hỏi.
 * English: Data Transfer Object for question difficulty statistics.
 */
export class QuestionStatisticsResponseDTO implements IQuestionStatisticsResponseDTO {
  public readonly totalAttempts: number;
  public readonly correctCount: number;
  public readonly wrongCount: number;
  public readonly errorRate: number;
  public readonly averageDuration: number;
  public readonly createdAt: Date | string;
  public readonly updatedAt: Date | string;

  constructor(data: IQuestionStatisticsResponseDTO) {
    this.totalAttempts = data.totalAttempts;
    this.correctCount = data.correctCount;
    this.wrongCount = data.wrongCount;
    this.errorRate = data.errorRate;
    this.averageDuration = data.averageDuration;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Phương thức tĩnh để khởi tạo nhanh DTO từ dữ liệu thô (Entity/Database).
   */
  public static create(data: IQuestionStatisticsResponseDTO): QuestionStatisticsResponseDTO {
    return new QuestionStatisticsResponseDTO(data);
  }
}