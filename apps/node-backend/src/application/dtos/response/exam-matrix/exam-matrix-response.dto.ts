/**
 * @description Giao diện đại diện cho chi tiết từng chương trong ma trận đề thi.
 */
export interface IExamMatrixDetailResponseDTO {
  /** @description ID của chương học. (ID of the chapter.) */
  readonly chapterId: string;

  /** @description Tỉ trọng phần trăm câu hỏi của chương này trong đề. (Percentage weight of questions from this chapter.) */
  readonly percentage: number;
}

/**
 * @description Giao diện dữ liệu trả về cho Ma trận đề thi.
 */
export interface IExamMatrixResponseDTO {
  /** @description ID duy nhất của ma trận (UUID). (Unique matrix ID.) */
  readonly id: string;

  /** @description ID của hạng bằng lái liên quan. (ID of the related license category.) */
  readonly licenseCategoryId: string;

  /** @description Tên hiển thị của hạng bằng lái. (Display name of the license category.) */
  readonly licenseCategoryName: string;

  /** @description Tên hiển thị của ma trận đề thi. (Display name of the exam matrix.) */
  readonly name: string;

  /** @description Tổng số câu hỏi trong một bài thi. (Total number of questions in an exam.) */
  readonly totalQuestions: number;

  /** @description Số điểm tối thiểu để đạt bài thi. (Minimum score required to pass.) */
  readonly passingScore: number;

  /** @description Thời gian làm bài tính theo phút. (Exam duration in minutes.) */
  readonly durationMinutes: number;

  /** @description Số câu hỏi điểm liệt tối thiểu phải có. (Minimum number of critical questions required.) */
  readonly minCriticalQuestions: number;

  /** @description Trạng thái hiện tại (active, draft, deleted). (Current status.) */
  readonly status: string;

  /** @description Xác định đây là ma trận mặc định cho hạng bằng này. (Identifies if this is the default matrix.) */
  readonly isDefault: boolean;

  /** @description Xác định ma trận này có phân bổ theo chương hay không. (Determines if this matrix is allocated by chapter.) */
  readonly isChapter: boolean;

  /** @description Danh sách tỉ trọng câu hỏi theo từng chương. (List of question weights by chapter.) */
  readonly details: IExamMatrixDetailResponseDTO[];

  /** @description Ngày tạo bản ghi. (Creation date.) */
  readonly createdAt: Date;
}

/**
 * @description Đối tượng chuyển đổi dữ liệu (DTO) dùng để trả về dữ liệu Ma trận đề thi cho Client.
 * Đảm bảo dữ liệu nhất quán và đã được chuẩn hóa định dạng camelCase.
 */
export class ExamMatrixResponseDTO implements IExamMatrixResponseDTO {
  public readonly id: string;
  public readonly licenseCategoryId: string;
  public readonly licenseCategoryName: string;
  public readonly name: string;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly durationMinutes: number;
  public readonly minCriticalQuestions: number;
  public readonly status: string;
  public readonly isDefault: boolean;
  public readonly isChapter: boolean;
  public readonly details: IExamMatrixDetailResponseDTO[];
  public readonly createdAt: Date;

  constructor(props: IExamMatrixResponseDTO) {
    this.id = props.id;
    this.licenseCategoryId = props.licenseCategoryId;
    this.licenseCategoryName = props.licenseCategoryName;
    this.name = props.name;
    this.totalQuestions = props.totalQuestions;
    this.passingScore = props.passingScore;
    this.durationMinutes = props.durationMinutes;
    this.minCriticalQuestions = props.minCriticalQuestions;
    this.status = props.status;
    this.isDefault = props.isDefault;
    this.isChapter = props.isChapter;
    this.details = props.details;
    this.createdAt = props.createdAt;
  }
}