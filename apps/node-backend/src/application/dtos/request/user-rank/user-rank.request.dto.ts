import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface ISyncRankInputDTO
 * @description Hợp đồng dữ liệu đầu vào cho việc đồng bộ thống kê và thứ hạng.
 * Bổ sung đầy đủ Metadata để phục vụ Rich Domain Logic tại Entity.
 */
export interface ISyncRankInputDTO {
  readonly userId: string;
  readonly examId: string;
  readonly examName: string;       // Tên đề thi để lưu kỷ lục
  readonly licenseCategoryId: string;
  readonly attemptId: string;      // ID của Snapshot chi tiết
  
  readonly score: number;          // Số câu đúng (Correct Answers)
  readonly wrongAnswers: number;   // Số câu sai
  readonly unanswered: number;     // Số câu bỏ trống
  readonly totalQuestions: number; // Tổng số câu hỏi trong đề
  
  readonly durationSeconds: number;
  readonly isPassed: boolean;
  readonly isFailedByCritical: boolean; // Trượt do câu điểm liệt
}

/**
 * @class SyncRankRequestDTO
 * @description DTO gác cổng, thực hiện chuẩn hóa và kiểm soát tính toàn vẹn của dữ liệu kết quả thi.
 */
export class SyncRankRequestDTO implements ISyncRankInputDTO {
  public readonly userId: string;
  public readonly examId: string;
  public readonly examName: string;
  public readonly licenseCategoryId: string;
  public readonly attemptId: string;
  
  public readonly score: number;
  public readonly wrongAnswers: number;
  public readonly unanswered: number;
  public readonly totalQuestions: number;
  
  public readonly durationSeconds: number;
  public readonly isPassed: boolean;
  public readonly isFailedByCritical: boolean;

  constructor(data: ISyncRankInputDTO) {
    // 1. Kiểm tra tính hợp lệ trước khi gán
    this.validate(data);

    // 2. Chuẩn hóa chuỗi
    this.userId = data.userId.trim();
    this.examId = data.examId.trim();
    this.examName = data.examName.trim();
    this.licenseCategoryId = data.licenseCategoryId.trim();
    this.attemptId = data.attemptId.trim();
    
    // 3. Chuẩn hóa số liệu (Ép kiểu và làm tròn)
    this.score = Math.floor(Number(data.score));
    this.wrongAnswers = Math.floor(Number(data.wrongAnswers));
    this.unanswered = Math.floor(Number(data.unanswered));
    this.totalQuestions = Math.floor(Number(data.totalQuestions));
    this.durationSeconds = Math.max(0, Number(data.durationSeconds));
    
    // 4. Boolean giữ nguyên
    this.isPassed = data.isPassed;
    this.isFailedByCritical = data.isFailedByCritical;
  }

  /**
   * @description Kiểm tra nghiệp vụ chuyên sâu cho bộ dữ liệu thống kê.
   */
  private validate(data: ISyncRankInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    const { EXAM_HISTORY: EH } = ErrorCode;

    // 1. Kiểm tra định danh & Metadata
    if (!data.userId) throw new AppError(EH.USER_ID_REQUIRED);
    if (!data.examId) throw new AppError(EH.HISTORY_NOT_FOUND);
    if (!data.examName) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT); // Cần tên để lưu kỷ lục
    if (!data.licenseCategoryId) throw new AppError(EH.CATEGORY_INFO_REQUIRED);
    if (!data.attemptId) throw new AppError(EH.SNAPSHOT_ID_REQUIRED);

    // 2. Kiểm tra bộ chỉ số câu hỏi (Metrics)
    if (data.score < 0 || data.wrongAnswers < 0 || data.unanswered < 0) {
      throw new AppError(EH.SCORE_CANNOT_BE_NEGATIVE);
    }
    
    if (!data.totalQuestions || data.totalQuestions <= 0) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // LOGIC CHECK: Tổng (Đúng + Sai + Trống) phải bằng tổng số câu trong đề
    const checkSum = data.score + data.wrongAnswers + data.unanswered;
    if (checkSum !== data.totalQuestions) {
      throw new AppError(EH.INVALID_SCORE); 
    }

    // 3. Kiểm tra tính logic của kết quả
    // Nếu trượt do điểm liệt thì isPassed bắt buộc phải là false
    if (data.isFailedByCritical && data.isPassed) {
      throw new AppError(EH.INVALID_SCORE); // Logic mâu thuẫn
    }

    if (data.durationSeconds === undefined || data.durationSeconds < 0) {
      throw new AppError(EH.INVALID_DURATION);
    }

    if (typeof data.isPassed !== "boolean" || typeof data.isFailedByCritical !== "boolean") {
      throw new AppError(EH.RESULT_STATUS_REQUIRED);
    }
  }
}