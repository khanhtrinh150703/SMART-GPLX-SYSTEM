/**
 * @description Interface đại diện cho chi tiết từng chương trong ma trận đề thi (Response)
 */
export interface IExamMatrixDetailResponse {
  chapterId: string;
  percentage: number;
}

/**
 * @description Data Transfer Object (DTO) dùng để trả về dữ liệu Ma trận đề thi cho Client.
 * Đảm bảo lọc bỏ các trường nhạy cảm và chuẩn hóa định dạng camelCase.
 */
export class ExamMatrixResponseDTO {
  /** @description ID duy nhất của ma trận (UUID) */
  public readonly id: string;

  /** @description ID của hạng bằng lái liên quan */
  public readonly licenseCategoryId: string;

  /** @description Tổng số câu hỏi trong một đề thi */
  public readonly totalQuestions: number;

  /** @description Số điểm tối thiểu để đạt */
  public readonly passingScore: number;
  
  /** @description Tên hiển thị của đề thi. */
  public readonly name: string;

  /** @description Thời gian làm bài (phút) */
  public readonly durationMinutes: number;

  /** @description Số câu điểm liệt tối thiểu phải có trong đề (US-026) */
  public readonly minCriticalQuestions: number;

  /** @description Danh sách tỉ trọng câu hỏi theo từng chương */
  public readonly details: IExamMatrixDetailResponse[];

  constructor(props: ExamMatrixResponseDTO) {
    this.name = props.name;
    this.id = props.id;
    this.licenseCategoryId = props.licenseCategoryId;
    this.totalQuestions = props.totalQuestions;
    this.passingScore = props.passingScore;
    this.durationMinutes = props.durationMinutes;
    this.minCriticalQuestions = props.minCriticalQuestions;
    this.details = props.details;
  }
}