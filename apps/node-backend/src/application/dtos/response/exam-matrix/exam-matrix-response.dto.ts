/**
 * @description Giao diện đại diện cho chi tiết từng chương trong ma trận đề thi (Phản hồi)
 */
export interface IExamMatrixDetailResponseDTO {
  readonly chapterId: string;
  readonly percentage: number;
}

/**
 * @description Giao diện dữ liệu trả về cho Ma trận đề thi.
 */
export interface IExamMatrixResponseDTO {
  /** @description ID duy nhất của ma trận (UUID) */
  readonly id: string;

  /** @description ID của hạng bằng lái liên quan */
  readonly licenseCategoryId: string;

  /** @description Tổng số câu hỏi trong một bài thi */
  readonly totalQuestions: number;

  /** @description Số điểm tối thiểu để đạt */
  readonly passingScore: number;

  /** @description Tên hiển thị của bài thi. */
  readonly name: string;

  /** @description Thời gian làm bài (phút) */
  readonly durationMinutes: number;

  /** @description Số câu hỏi điểm liệt tối thiểu phải có trong bài thi (US-026) */
  readonly minCriticalQuestions: number;

  /** @description Trạng thái hiện tại (VD: 'active', 'draft', 'deleted'). */
  readonly status: string;

  /** @description Danh sách tỉ trọng câu hỏi theo từng chương */
  readonly details: IExamMatrixDetailResponseDTO[];

  /** @description Xác định đây là ma trận mặc định cho hạng bằng lái này */
  readonly isDefault: boolean;
}

/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) dùng để trả về dữ liệu Ma trận đề thi cho Client.
 * Đảm bảo lọc bỏ các trường nhạy cảm và chuẩn hóa định dạng camelCase.
 */
export class ExamMatrixResponseDTO implements IExamMatrixResponseDTO {
  public readonly id: string;
  public readonly licenseCategoryId: string;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly name: string;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly status: string;
  public readonly details: IExamMatrixDetailResponseDTO[];
  public readonly isDefault: boolean;

  constructor(props: IExamMatrixResponseDTO) {
    this.id = props.id;
    this.licenseCategoryId = props.licenseCategoryId;
    this.totalQuestions = props.totalQuestions;
    this.passingScore = props.passingScore;
    this.name = props.name;
    this.durationMinutes = props.durationMinutes;
    this.minCriticalQuestions = props.minCriticalQuestions;
    this.status = props.status;
    this.details = props.details;
    this.isDefault = props.isDefault;
  }
}