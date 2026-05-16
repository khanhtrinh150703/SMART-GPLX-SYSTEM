import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util"; // 💡 Đảm bảo import hàm helper isUUID của ông tại đây

/**
 * @interface ISyncRankInputDTO
 * @description Hợp đồng dữ liệu đầu vào cho việc đồng bộ thống kê và thứ hạng.
 */
export interface ISyncRankInputDTO {
  readonly userId: string;
  readonly examId: string;
  readonly examName: string;
  readonly licenseCategoryId: string;
  readonly attemptId: string;

  readonly score: number;
  readonly wrongAnswers: number;
  readonly unanswered: number;
  readonly totalQuestions: number;

  readonly durationSeconds: number;
  readonly isPassed: boolean;
  readonly isFailedByCritical: boolean;
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
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    // ============================================================
    // 1. CHUẨN HÓA VÀ GÁN DỮ LIỆU VÀO CLASS TRƯỚC (PARSE PHASE)
    // ============================================================
    // 💡 Sử dụng fallback "" phòng thủ chặt, tránh crash runtime nếu dữ liệu đầu vào thiếu trường
    this.userId = (data.userId || "").trim();
    this.examId = (data.examId || "").trim();
    this.examName = (data.examName || "").trim();
    this.licenseCategoryId = (data.licenseCategoryId || "").trim();
    this.attemptId = (data.attemptId || "").trim();

    // Ép kiểu số liệu thô phục vụ việc check logic sau đó
    this.score = Math.floor(Number(data.score));
    this.wrongAnswers = Math.floor(Number(data.wrongAnswers));
    this.unanswered = Math.floor(Number(data.unanswered));
    this.totalQuestions = Math.floor(Number(data.totalQuestions));
    this.durationSeconds = Number(data.durationSeconds);

    this.isPassed = data.isPassed;
    this.isFailedByCritical = data.isFailedByCritical;

    // ============================================================
    // 2. TIẾN HÀNH KIỂM TRA TRÊN CHÍNH THUỘC TÍNH (VALIDATE PHASE)
    // ============================================================
    // 💡 Không truyền 'data', toàn bộ logic validate bên trong sẽ gọi qua 'this'
    this.validate();

    // ============================================================
    // 3. CHUẨN HÓA HẬU VALIDATE (SANIZATION PHASE)
    // ============================================================
    this.durationSeconds = Math.max(0, this.durationSeconds);
  }

  /**
   * @description Kiểm tra nghiệp vụ chuyên sâu dựa trên các thuộc tính của instance (this).
   */
  private validate(): void {
    const { EXAM_HISTORY: EH } = ErrorCode;

    // 1. Kiểm tra sự tồn tại (Không được để trống)
    if (!this.userId) throw new AppError(EH.USER_ID_REQUIRED);
    if (!this.examId) throw new AppError(EH.HISTORY_NOT_FOUND);
    if (!this.examName) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    if (!this.licenseCategoryId) throw new AppError(EH.CATEGORY_INFO_REQUIRED);
    if (!this.attemptId) throw new AppError(EH.SNAPSHOT_ID_REQUIRED);

    // 2. Kiểm tra định dạng UUID cho toàn bộ thực thể ID liên quan
    if (!isUUID(this.userId))
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    if (!isUUID(this.examId))
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    if (!isUUID(this.licenseCategoryId))
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    if (!isUUID(this.attemptId))
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);

    // 3. Kiểm tra kiểu dữ liệu Boolean nguyên bản
    if (
      typeof this.isPassed !== "boolean" ||
      typeof this.isFailedByCritical !== "boolean"
    ) {
      throw new AppError(EH.RESULT_STATUS_REQUIRED);
    }

    // 4. Kiểm tra tính hợp lệ của bộ chỉ số câu hỏi (Metrics)
    if (this.score < 0 || this.wrongAnswers < 0 || this.unanswered < 0) {
      throw new AppError(EH.SCORE_CANNOT_BE_NEGATIVE);
    }

    if (Number.isNaN(this.totalQuestions) || this.totalQuestions <= 0) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // LOGIC CHECK: Tổng số câu (Đúng + Sai + Trống) bắt buộc phải khớp với tổng số câu cấu hình của đề
    const checkSum = this.score + this.wrongAnswers + this.unanswered;
    if (checkSum !== this.totalQuestions) {
      throw new AppError(EH.INVALID_SCORE);
    }

    // 5. Kiểm tra tính logic chặt chẽ của kết quả thi lý thuyết
    // Nếu bị đánh trượt do dính câu điểm liệt, thuộc tính Đỗ (isPassed) bắt buộc phải là false
    if (this.isFailedByCritical && this.isPassed) {
      throw new AppError(EH.INVALID_SCORE); // Mâu thuẫn logic nghiệp vụ
    }

    if (Number.isNaN(this.durationSeconds) || this.durationSeconds < 0) {
      throw new AppError(EH.INVALID_DURATION);
    }
  }
}
