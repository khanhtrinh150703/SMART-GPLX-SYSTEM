import { ISelectionResponseDTO, SelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";

/**
 * @description Giao diện mở rộng cho dữ liệu lựa chọn Ma trận đề thi.
 * (Extended interface for Exam Matrix selection data).
 */
export interface IExamMatrixSelectionResponseDTO extends ISelectionResponseDTO {
  /** @description Tên hạng bằng lái hiển thị (VD: "Hạng B2"). */
  readonly licenseCategoryName: string;

  /** @description ID duy nhất của hạng bằng lái (UUID). */
  readonly licenseCategoryId: string;

  /** @description Tổng số câu hỏi có trong một đề thi được tạo từ ma trận này. */
  readonly totalQuestions: number;

  /** @description Thời gian làm bài tính bằng phút. */
  readonly durationMinutes: number;

  /** @description Số điểm tối thiểu để được công nhận là đạt. */
  readonly passingScore: number;

  /** @description Số lượng câu hỏi điểm liệt tối thiểu bắt buộc phải có. */
  readonly minCriticalQuestions: number;

  /** @description Thời điểm ma trận được tạo trong hệ thống. */
  readonly createdAt: Date;
}

/**
 * @description DTO phản hồi lựa chọn Ma trận đề thi với đầy đủ thông tin kỹ thuật.
 * (Exam Matrix selection response DTO with full technical metadata).
 * Sử dụng để cung cấp dữ liệu cho các dropdown hoặc danh sách chọn nhanh.
 */
export class ExamMatrixSelectionResponseDTO extends SelectionResponseDTO implements IExamMatrixSelectionResponseDTO {
  public readonly licenseCategoryName: string;
  public readonly licenseCategoryId: string;
  public readonly totalQuestions: number;
  public readonly durationMinutes: number;
  public readonly passingScore: number;
  public readonly minCriticalQuestions: number;
  public readonly createdAt: Date;

  constructor(data: IExamMatrixSelectionResponseDTO) {
    // 1. Gọi constructor của lớp cha để gán value, label, orderIndex
    // (Call parent constructor to assign base properties)
    super(data);

    // 2. Gán các thuộc tính đặc thù của Ma trận
    // (Assign matrix-specific properties)
    this.licenseCategoryId = data.licenseCategoryId;
    this.totalQuestions = data.totalQuestions;
    this.durationMinutes = data.durationMinutes;
    this.passingScore = data.passingScore;
    this.licenseCategoryName = data.licenseCategoryName;
    this.minCriticalQuestions = data.minCriticalQuestions;
    this.createdAt = data.createdAt;
  }
}