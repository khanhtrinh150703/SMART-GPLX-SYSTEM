import { ImportStep, IImportError } from "@/domain/entities/import/import-result.type";

/**
 * @description Dữ liệu chi tiết về tiến trình xử lý bên trong.
 */
export interface IImportProgressDTO {
  /** @description Phần trăm hoàn thành (0-100) */
  percent: number;
  /** @description Bước hiện tại của Worker (ví dụ: 'EXTRACTING', 'SAVING_DATABASE') */
  currentStep: ImportStep;
  /** @description Thống kê con số thực tế */
  metadata: {
    totalRows: number;
    processedRows: number;
    successCount: number;
    errorCount: number;
  };
  /** @description Danh sách lỗi chi tiết (nếu có) */
  errors: IImportError[];
}