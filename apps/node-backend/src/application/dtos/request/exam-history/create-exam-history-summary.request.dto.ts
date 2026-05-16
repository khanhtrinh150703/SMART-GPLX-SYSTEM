import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface ICreateExamHistorySummaryInputDTO
 * @description Giao diện dữ liệu đầu vào cho bản tóm tắt lịch sử thi.
 */
export interface ICreateExamHistorySummaryInputDTO {
  readonly userId: string;
  readonly licenseCategoryId: string;
  readonly licenseCategoryName: string;
  readonly examName: string;
  readonly score: number;
  readonly totalQuestions: number;
  readonly isPassed: boolean;
  readonly durationSeconds: number;
  readonly snapshotId: string;
  readonly isAutoSubmit?: boolean;
}

/**
 * @class CreateExamHistorySummaryDTO
 * @description DTO chuẩn hóa dữ liệu tóm tắt kết quả thi trước khi xử lý nghiệp vụ hoặc lưu trữ.
 * @principle Data Consistency - Đảm bảo các con số thống kê và định danh hạng bằng luôn chính xác.
 */
export class CreateExamHistorySummaryDTO implements ICreateExamHistorySummaryInputDTO {
  public readonly userId: string;
  public readonly licenseCategoryId: string;
  public readonly licenseCategoryName: string;
  public readonly examName: string;
  public readonly score: number;
  public readonly totalQuestions: number;
  public readonly isPassed: boolean;
  public readonly durationSeconds: number;
  public readonly snapshotId: string;
  public readonly isAutoSubmit: boolean;

  constructor(data: ICreateExamHistorySummaryInputDTO) {
    // 1. Kiểm tra tính hợp lệ đa tầng ngay tại cửa ngõ
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu chuỗi
    this.userId = data.userId;
    this.licenseCategoryId = data.licenseCategoryId;
    this.examName = data.examName;
    this.licenseCategoryName = data.licenseCategoryName.trim();
    this.score = data.score;
    this.totalQuestions = data.totalQuestions;
    this.isPassed = data.isPassed;
    this.durationSeconds = data.durationSeconds;
    this.snapshotId = data.snapshotId;
    this.isAutoSubmit = data.isAutoSubmit ?? false;
  }

  /**
   * @description Hàm gác cổng thực hiện kiểm tra logic nghiệp vụ cho dữ liệu tóm tắt.
   * @private
   */
  private validate(data: ICreateExamHistorySummaryInputDTO): void {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    const { EXAM_HISTORY: EH } = ErrorCode;

    // 1. Kiểm tra các định danh bắt buộc (Identifiers)
    if (!data.userId || typeof data.userId !== "string") {
      throw new AppError(EH.USER_ID_REQUIRED);
    }

    if (!data.snapshotId || typeof data.snapshotId !== "string") {
      throw new AppError(EH.SNAPSHOT_ID_REQUIRED);
    }

    // 2. Kiểm tra thông tin hạng bằng lái (Category Info)
    if (!data.licenseCategoryId || !data.licenseCategoryName) {
      throw new AppError(EH.CATEGORY_INFO_REQUIRED);
    }

    // 3. Kiểm tra tính logic của các thông số kỹ thuật (Numeric Logic)
    if (data.score < 0) {
      throw new AppError(EH.SCORE_CANNOT_BE_NEGATIVE);
    }

    if (data.totalQuestions <= 0) {
      throw new AppError(EH.TOTAL_QUESTIONS_INVALID);
    }

    if (data.score > data.totalQuestions) {
      throw new AppError(EH.SCORE_EXCEEDS_TOTAL);
    }

    if (data.durationSeconds < 0) {
      throw new AppError(EH.INVALID_DURATION);
    }

    // 4. Kiểm tra trạng thái kết quả (Boolean Validation)
    if (typeof data.isPassed !== "boolean") {
      throw new AppError(EH.RESULT_STATUS_REQUIRED);
    }
  }
}
