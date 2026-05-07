import { ImportStatus } from "@/domain/entities/import/import.status";

/**
 * @description Giao diện dữ liệu trả về cho trạng thái chi tiết của công việc Import.
 * (Interface for the detailed processing status response of the Import Job.)
 */
export interface IImportJobStatusResponseDTO {
  /** @description Mã định danh duy nhất của công việc (UUID). */
  readonly jobId: string;

  /** @description Trạng thái hiện tại của tiến trình. */
  readonly status: ImportStatus;

  /** @description Phần trăm hoàn thành (0-100). */
  readonly progress: number;

  /** @description Thống kê các con số thực tế trong quá trình xử lý. */
  readonly metadata: {
    readonly totalRows: number;
    readonly processedRows: number;
    readonly successCount: number;
    readonly errorCount: number;
  };

  /** @description Danh sách chi tiết các lỗi theo dòng và cột. */
  readonly errors: Array<{
    readonly row: number;
    readonly column: string;
    readonly message: string;
  }>;

  /** @description Bước hiện tại của tiến trình xử lý (VD: 'VALIDATING', 'IMPORTING'). */
  readonly currentStep: string;

  /** @description Thông báo lỗi cuối cùng ghi nhận được (nếu có). */
  readonly lastError: string;
}

/**
 * @description DTO vận chuyển trạng thái chi tiết của Job Import.
 * Đóng vai trò mang dữ liệu thống kê, tiến độ và danh sách lỗi chi tiết để phản hồi cho Client.
 */
export class ImportJobStatusResponseDTO implements IImportJobStatusResponseDTO {
  public readonly jobId: string;
  public readonly status: ImportStatus;
  public readonly progress: number;
  public readonly metadata: {
    readonly totalRows: number;
    readonly processedRows: number;
    readonly successCount: number;
    readonly errorCount: number;
  };
  public readonly errors: Array<{
    readonly row: number;
    readonly column: string;
    readonly message: string;
  }>;
  public readonly currentStep: string;
  public readonly lastError: string;

  constructor(data: IImportJobStatusResponseDTO) {
    this.jobId = data.jobId;
    this.status = data.status;
    this.progress = data.progress;
    this.metadata = {
      totalRows: data.metadata.totalRows,
      processedRows: data.metadata.processedRows,
      successCount: data.metadata.successCount,
      errorCount: data.metadata.errorCount,
    };
    this.errors = Array.isArray(data.errors) ? data.errors : [];
    this.currentStep = data.currentStep;
    this.lastError = data.lastError || '';
  }
}