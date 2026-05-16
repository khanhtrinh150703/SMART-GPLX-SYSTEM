import { AppError, ErrorCode } from "@/shared/errors";
import {
  CreateExamMatrixProps,
  IExamMatrixDetailProps,
  IExamMatrixProps,
} from "./exam-matrix.props";
import { BaseEntity } from "@/domain/seedwork/entity.base";

export interface IUpdateMatrixConfig {
  name: string;
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  details: IExamMatrixDetailProps[];
  isDefault: boolean;
  isChapter: boolean;
}

/**
 * @description Thực thể Ma trận đề thi (Exam Matrix).
 * Quản lý cấu trúc bộ đề: số lượng câu hỏi, điểm đạt và thời gian làm bài.
 */
export class ExamMatrix extends BaseEntity<IExamMatrixProps> {
  /**
   * @description Constructor đơn giản, không chứa logic tính toán thời gian.
   */
  private constructor(props: IExamMatrixProps) {
    super(props);
    this.validate(); // Validation vẫn nên nằm ở đây để check tính toàn vẹn
  }

  /**
   * @description Factory Method: Khởi tạo một Ma trận đề mới.
   */
  public static create(props: CreateExamMatrixProps): ExamMatrix {
    const now = new Date();

    const finalizedProps: IExamMatrixProps = {
      ...props,
      id: crypto.randomUUID(),

      // Normalization: Gọt giũa dữ liệu
      name: props.name.trim(),

      // Gán giá trị mặc định nếu không truyền vào
      totalQuestions: props.totalQuestions ?? 0,
      passingScore: props.passingScore ?? 0,
      durationMinutes: props.durationMinutes ?? 0,

      // Timestamps khởi tạo
      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    } as IExamMatrixProps;

    return new ExamMatrix(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể từ Database (Resurrection).
   */
  public static reconstitute(props: IExamMatrixProps): ExamMatrix {
    return new ExamMatrix(props);
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  // Getters
  get id() {
    return this._props.id;
  }

  public updateConfig(payload: IUpdateMatrixConfig): void {
    // 1. Kiểm tra xem có thực sự thay đổi dữ liệu không (
    const isDetailsChanged =
      JSON.stringify(this._props.details) !== JSON.stringify(payload.details);
    const isBasicInfoChanged =
      this._props.name !== payload.name ||
      this._props.totalQuestions !== payload.totalQuestions ||
      this._props.passingScore !== payload.passingScore ||
      this._props.durationMinutes !== payload.durationMinutes ||
      this._props.minCriticalQuestions !== payload.minCriticalQuestions ||
      this._props.isDefault !== payload.isDefault ||
      this._props.isChapter !== payload.isChapter;

    if (!isDetailsChanged && !isBasicInfoChanged) return;

    // 2. Cập nhật dữ liệu (Lấy thằng mới hoàn toàn cho dễ quản lý)
    this._props.name = payload.name;
    this._props.totalQuestions = payload.totalQuestions;
    this._props.passingScore = payload.passingScore;
    this._props.durationMinutes = payload.durationMinutes;
    this._props.minCriticalQuestions = payload.minCriticalQuestions;
    this._props.isDefault = payload.isDefault;
    this._props.isChapter = payload.isChapter;


    // Mapping lại details để đảm bảo tính bất biến 
    this._props.details = payload.details.map((detail) => ({
      chapterId: detail.chapterId,
      percentage: detail.percentage,
    }));

    // 3. Tự động cập nhật thời gian
    this.touch();

    // 4. Chốt chặn: Bắt buộc validate lại toàn bộ Invariants (Tổng 100%, > 0%, không trùng...)
    this.validate();
  }

  /**
   * @description Quy tắc nghiệp vụ bắt buộc:
   * 1. Tổng % các chương phải bằng 100%.
   * 2. Điểm đạt không được cao hơn tổng số câu.
   */
  private validate(): void {
    // Kiểm tra danh sách chi tiết trống
    if (this._props.details.length === 0) {
      throw new AppError(ErrorCode.MATRIX.NO_DETAILS);
    }
    const chapterIds = this._props.details.map((d) => d.chapterId);
    const uniqueChapters = new Set(chapterIds);
    if (uniqueChapters.size !== chapterIds.length) {
      throw new AppError(ErrorCode.MATRIX.DUPLICATE_CHAPTER);
    }
    // Kiểm tra tổng phần trăm
    const totalPercent = this._props.details.reduce(
      (sum, d) => sum + d.percentage,
      0,
    );
    if (totalPercent !== 100) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PERCENTAGE);
    }

    // Kiểm tra điểm đạt (passing score) không được vượt quá tổng số câu
    if (this._props.passingScore > this._props.totalQuestions) {
      throw new AppError(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
    }
  }

  /**
   * @description Kiểm tra xem thực thể có đang trong trạng thái bị xóa hay không.
   * @returns {boolean} True nếu đã bị xóa mềm.
   */
  public isDeleted(): boolean {
    return !!this.props.deletedAt;
  }
}
