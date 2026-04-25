import { IMPORT_STATUS, ImportStatus } from "@/domain/entities/import/import.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { CreateImportJobProps, IImportJobProps} from "./import-job.props";
import { IImportResultData, ImportStep } from "@/domain/entities/import/import-result.type";
import { BaseEntity } from "@/domain/seedwork/entity.base";
import { IMPORT_CONFIG } from "@/shared/config/import.config";

/**
 * @description Thực thể quản lý vòng đời và logic nghiệp vụ của tiến trình Import.
 * Tuân thủ chuẩn Rich Domain: Mọi thay đổi trạng thái phải thông qua các phương thức nghiệp vụ.
 */
export class ImportJobEntity extends BaseEntity<IImportJobProps> {

  private constructor(props: IImportJobProps) {
    super(props);
  }

  /**
   * @description Factory Method - Nơi duy nhất chứa logic khởi tạo dữ liệu mới
   */
  public static create(props: CreateImportJobProps): ImportJobEntity {
    const now = new Date();

    // 1. Khởi tạo cấu trúc Result Data mặc định
    const defaultResult: IImportResultData = {
      totalRows: 0,
      processedRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      currentStep: 'QUEUED',
    };

    // 2. Chuẩn hóa dữ liệu trước khi đưa vào constructor
    const finalizedProps: IImportJobProps = {
      ...props,
      id: crypto.randomUUID(),
      status: props.status ?? IMPORT_STATUS.PENDING,
      // Sử dụng hàm static để tính toán
      expiresAt: props.expiresAt ?? this.calculateExpiryDate(),
      totalChunks: Math.ceil(props.totalSize / IMPORT_CONFIG.chunk.sizeLimit),
      chunkSizeLimit: IMPORT_CONFIG.chunk.sizeLimit,
      resultData: { ...defaultResult, ...props.resultData },
      createdAt: now,
      updatedAt: now,
    } as IImportJobProps;

    return new ImportJobEntity(finalizedProps);
  }

  public static reconstitute(props: IImportJobProps): ImportJobEntity {
    return new ImportJobEntity(props);
  }

  /** @description Cập nhật dấu thời gian thay đổi cuối cùng. */
  private touch(): void {
    this._props.updatedAt = new Date();
  }

  // --- Getters (Read-only) ---
  public get id(): string { return this._props.id!; }
  public get status(): ImportStatus { return this._props.status; }
  public get resultData(): Readonly<IImportResultData> { return this._props.resultData; }
  public get totalChunks(): number { return this._props.totalChunks; }

  // --- Business Logic (State Mutators) ---

  /**
   * @description Thiết lập tổng số dòng thực tế từ file Excel.
   */
  public setTotalRows(total: number): void {
    this._props.resultData.totalRows = total;
    this.touch();
  }

  /**
   * @description Ghi nhận một dòng xử lý thành công.
   * Tăng tiến độ tổng và số lượng thành công.
   */
  public incrementSuccessCount(): void {
    this._props.resultData.processedRows = (this._props.resultData.processedRows ?? 0) + 1;
    this._props.resultData.successCount = (this._props.resultData.successCount ?? 0) + 1;
    this.touch();
  }

  /**
   * @description Ghi nhận một dòng thất bại với thông tin chi tiết.
   * @param index Số thứ tự dòng trong Excel.
   * @param reason Lý do lỗi chính.
   * @param details Mảng các lỗi chi tiết (vd: lỗi từ validate entity).
   */
  public addErrorLog(index: number, column: string, reason: string, details: string[] = []): void {
    this._props.resultData.processedRows = (this._props.resultData.processedRows ?? 0) + 1;
    this._props.resultData.errorCount = (this._props.resultData.errorCount ?? 0) + 1;
    this._props.resultData.errors.push({
      row: index,
      column: column,
      message: reason,
      details: details,
      timestamp: new Date().toISOString()
    });
    this._props.updatedAt = new Date();
  }

  /**
   * @description Cập nhật bước xử lý hiện tại (EXTRACTING, PROCESSING...).
   */
  public updateStep(step: ImportStep): void {
    this._props.resultData.currentStep = step;
    this.touch();
  }

  /**
   * @description Đánh dấu bắt đầu xử lý trong Worker.
   */
  public markAsProcessing(): void {
    if (this._props.status !== IMPORT_STATUS.QUEUED) {
      throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
    }
    this._props.status = IMPORT_STATUS.PROCESSING;
    this.updateStep('PROCESSING');
  }

  /**
   * @description Hoàn tất Job với trạng thái thành công.
   */
  public markAsCompleted(): void {
    this._props.status = IMPORT_STATUS.COMPLETED;
    this._props.resultData.currentStep = 'COMPLETED';

    // Đảm bảo progress đạt 100% khi kết thúc
    const total = this._props.resultData.totalRows ?? 0;
    if (total > 0) {
      this._props.resultData.processedRows = total;
    }
    this.touch();
  }

  /**
   * @description Đánh dấu Job thất bại do lỗi nghiêm trọng (System Error).
   */
  public markAsFailed(errorMessage: string): void {
    this._props.status = IMPORT_STATUS.FAILED;
    this._props.resultData.currentStep = 'FAILED';
    this._props.resultData.lastError = errorMessage;
    this.touch();
  }

  /**
   * @description Kiểm tra xem phiên làm việc có đang trong trạng thái chờ upload hay không.
   */
  public isPending(): boolean {
    return this._props.status === IMPORT_STATUS.PENDING;
  }

  /**
   * @description Kiểm tra điều kiện tổng thể để hoàn tất giai đoạn upload.
   * Logic: Phải đang ở trạng thái PENDING và chưa bị hết hạn.
   */
  public canComplete(): boolean {
    return this.isPending() && !this.isExpired();
  }

  /**
   * @description Kiểm tra tính hợp lệ của mảnh file (chunk) nhận được từ Client.
   * @throws {AppError} Nếu kích thước vượt quá giới hạn cấu hình.
   */
  public validateChunkSize(actualSize: number): void {
    // Giới hạn này thường được config lúc tạo Job (ví dụ: 1MB/chunk)
    if (actualSize > this._props.chunkSizeLimit) {
      throw new AppError(
        ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED,
        `Kích thước mảnh file (${actualSize} bytes) vượt quá giới hạn cho phép.`
      );
    }
  }

  /**
   * @description Chuyển trạng thái sang QUEUED (Đang chờ xử lý).
   * Dùng sau khi Client đã gửi đủ 100% các chunk và hệ thống đã gộp file xong.
   */
  public markAsQueued(): void {
    // Chỉ cho phép chuyển sang hàng chờ nếu đang ở trạng thái PENDING
    if (!this.isPending()) {
      throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS, "Chỉ có thể đưa Job vào hàng chờ khi đang ở trạng thái PENDING.");
    }

    this._props.status = IMPORT_STATUS.QUEUED;
    this.updateStep('QUEUED');
    this.touch();
  }


  // --- Helpers ---
  public isExpired(): boolean {
    return new Date() > this._props.expiresAt!;
  }

  private static calculateExpiryDate(): Date {
    const now = new Date();
    return new Date(now.getTime() + IMPORT_CONFIG.session.expiryHours * 3600 * 1000);
  }

  public get progressPercentage(): number {
    // FIX: Trích xuất an toàn với giá trị mặc định là 0
    const totalRows = this._props.resultData.totalRows ?? 0;
    const processedRows = this._props.resultData.processedRows ?? 0;

    if (totalRows <= 0) return 0;

    const percentage = Math.round((processedRows / totalRows) * 100);
    return Math.min(percentage, 100);
  }
}