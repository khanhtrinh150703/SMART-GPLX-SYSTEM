import { ImportStep, IImportError } from "@/domain/entities/import/import-result.type";

/**
 * @description Giao diện dữ liệu chi tiết về tiến trình xử lý bên trong.
 * (Interface for the detailed internal processing progress data.)
 */
export interface IImportProgressResponseDTO {
  /** @description Phần trăm hoàn thành (0-100). (Completion percentage 0-100.) */
  readonly percent: number;

  /** @description Bước hiện tại của Worker xử lý. (Current step of the processing worker.) */
  readonly currentStep: ImportStep;

  /** @description Thống kê các con số thực tế trong quá trình xử lý. (Statistics of actual figures during processing.) */
  readonly metadata: {
    readonly totalRows: number;
    readonly processedRows: number;
    readonly successCount: number;
    readonly errorCount: number;
  };

  /** @description Danh sách các lỗi chi tiết phát sinh (nếu có). (List of detailed errors incurred, if any.) */
  readonly errors: IImportError[];
}

/**
 * @description DTO vận chuyển tiến độ Import chi tiết.
 * Đóng vai trò mang dữ liệu thống kê và trạng thái bước xử lý hiện tại để phản hồi cho Client.
 */
export class ImportProgressResponseDTO implements IImportProgressResponseDTO {
  public readonly percent: number;
  public readonly currentStep: ImportStep;
  public readonly metadata: {
    readonly totalRows: number;
    readonly processedRows: number;
    readonly successCount: number;
    readonly errorCount: number;
  };
  public readonly errors: IImportError[];

  constructor(data: IImportProgressResponseDTO) {
    this.percent = data.percent;
    this.currentStep = data.currentStep;
    this.metadata = {
      totalRows: data.metadata.totalRows,
      processedRows: data.metadata.processedRows,
      successCount: data.metadata.successCount,
      errorCount: data.metadata.errorCount,
    };
    this.errors = Array.isArray(data.errors) ? data.errors : [];
  }
}