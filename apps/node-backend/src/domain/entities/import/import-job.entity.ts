import { IMPORT_STATUS, ImportStatus } from "@/domain/entities/import/import.status";
import { AppError, ErrorCode } from "@/shared/errors";
import { IImportJobProps, CreateImportJobProps } from "./import-job.props";
import { IMPORT_CONFIG } from "@/domain/constants/import.constant";
import { IImportResultData, ImportStep } from "@/domain/entities/import/import-result.type";

/**
 * @description Thực thể quản lý vòng đời và logic nghiệp vụ của tiến trình Import.
 */
export class ImportJobEntity {
  private readonly _props: IImportJobProps;

  constructor(props: CreateImportJobProps) {
    // Khởi tạo giá trị mặc định cho resultData để tránh lỗi null/undefined
    const defaultResultData: IImportResultData = {
      totalRows: 0,
      processedRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      currentStep: 'QUEUED',
      ...(props.resultData || {})
    };

    this._props = {
      ...props,
      status: props.status ?? IMPORT_STATUS.PENDING,
      expiresAt: props.expiresAt ?? new Date(Date.now() + IMPORT_CONFIG.SESSION_EXPIRY_HOURS * 60 * 60 * 1000),
      resultData: defaultResultData
    };
  }

  // --- Getters (Read-only access) ---
  public get id(): string | undefined { return this._props.id; }
  public get fileName(): string { return this._props.fileName; }
  public get totalSize(): number { return this._props.totalSize; }
  public get totalChunks(): number { return this._props.totalChunks; }
  public get status(): ImportStatus { return this._props.status; }
  public get chunkSizeLimit(): number { return this._props.chunkSizeLimit; }
  public get expiresAt(): Date { return this._props.expiresAt!; }
  public get resultData(): IImportResultData { return this._props.resultData; }

  /**
   * @description Truy cập toàn bộ props dưới dạng Readonly
   */
  public get props(): Readonly<IImportJobProps> {
    return Object.freeze({ ...this._props });
  }

  // --- Business Logic (Rich Domain Methods) ---

  /**
   * @description Kiểm tra tính hợp lệ của mảnh file (chunk)
   */
  public validateChunkSize(actualSize: number): void {
    if (actualSize > this._props.chunkSizeLimit) {
      throw new AppError(ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED);
    }
  }

  /**
   * @description Kiểm tra phiên làm việc đã hết hạn chưa
   */
  public isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  /**
   * @description Cập nhật bước xử lý hiện tại của Worker
   */
  public updateStep(step: ImportStep): void {
    this._props.resultData.currentStep = step;
  }

  /**
   * @description Chuyển trạng thái sang QUEUED sau khi gộp file xong
   */
  public markAsQueued(): void {
    if (this._props.status !== IMPORT_STATUS.PENDING) {
      throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
    }
    this._props.status = IMPORT_STATUS.QUEUED;
    this.updateStep('QUEUED');
  }

  /**
   * @description Chuyển trạng thái sang PROCESSING khi Worker bắt đầu làm việc
   */
  public markAsProcessing(): void {
    if (this._props.status !== IMPORT_STATUS.QUEUED) {
      throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
    }
    this._props.status = IMPORT_STATUS.PROCESSING;
  }

  /**
   * @description Hoàn thành tiến trình và lưu kết quả cuối cùng
   */
  /**
   * @description Đánh dấu hoàn tất phiên làm việc
   * (Dịch: Mark the job as successfully completed)
   */
  public markAsCompleted(): void {
    // 1. Chỉ cho phép hoàn tất khi đang ở trạng thái PROCESSING hoặc QUEUED
    const allowedStatuses: ImportStatus[] = [IMPORT_STATUS.PROCESSING, IMPORT_STATUS.QUEUED];

    if (!allowedStatuses.includes(this._props.status)) {
      throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
    }

    // 2. Cập nhật trạng thái chính
    this._props.status = IMPORT_STATUS.COMPLETED;

    // 3. Cập nhật Step và ép tiến độ về tối đa (để FE hiển thị 100%)
    this._props.resultData.currentStep = 'COMPLETED';

    // Đảm bảo số dòng đã xử lý bằng tổng số dòng (nếu trước đó có sai lệch nhỏ)
    if (this._props.resultData.totalRows > 0) {
      this._props.resultData.processedRows = this._props.resultData.totalRows;
    }

    this._props.updatedAt = new Date();
  }

  /**
   * @description Ghi nhận thất bại của tiến trình
   */
  public markAsFailed(errorMessage: string): void {
    this._props.status = IMPORT_STATUS.FAILED;
    this._props.resultData.currentStep = 'FAILED';
    this._props.resultData.lastError = errorMessage;
  }

  /**
   * @description Tính toán % tiến độ dựa trên dữ liệu thực tế
   */
  public get progressPercentage(): number {
    const { totalRows, processedRows } = this._props.resultData;
    if (totalRows === 0) return 0;
    return Math.round((processedRows / totalRows) * 100);
  }

  /**
   * @description Kiểm tra xem phiên làm việc có đang trong trạng thái chờ upload hay không.
   * Giúp che giấu logic so sánh chuỗi 'PENDING' bên trong thực thể.
   */
  public isPending(): boolean {
    return this._props.status === IMPORT_STATUS.PENDING;
  }

  /**
   * @description Kiểm tra điều kiện tổng thể để hoàn tất giai đoạn upload.
   * Hiện tại chỉ check status, nhưng có thể mở rộng thêm logic kiểm tra đủ chunk.
   */
  public canComplete(): boolean {
    // Logic: Phải đang PENDING và chưa bị hết hạn
    return this.isPending() && !this.isExpired();
  }

  public toJSON(): IImportJobProps {
    return { ...this._props };
  }

  // --- STATE MUTATORS (Những hàm thay đổi trạng thái) ---

  /**
   * @description Thiết lập tổng số dòng sẽ xử lý
   */
  public setTotalRows(total: number): void {
    this._props.resultData.totalRows = total;
  }

  /**
   * @description Cập nhật trạng thái chi tiết của tiến trình
   */
  public updateProgress(
    total: number,
    processed: number,
    success: number,
    error: number
  ): void {
    this._props.resultData.totalRows = total;
    this._props.resultData.processedRows = processed;
    this._props.resultData.successCount = success;
    this._props.resultData.errorCount = error;

    // Tự động cập nhật step nếu cần (Optionally)
    if (processed === total && total > 0) {
      this._props.resultData.currentStep = 'COMPLETED';
    }
  }

  /**
   * @description Ghi nhận lỗi tại một dòng và cột cụ thể
   * (Dịch: Record error at a specific row and column)
   */
  public addError(rowNumber: number, message: string, column: string = 'General'): void {
    this._props.resultData.errors.push({
      row: rowNumber,
      column: column, // Bổ sung để khớp với IImportError
      message: message,
      timestamp: new Date().toISOString()
    });

    // Tự động tăng errorCount khi có lỗi mới
    this._props.resultData.errorCount++;
  }
}