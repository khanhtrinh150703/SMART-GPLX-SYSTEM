import { ImportStatus } from "@/domain/entities/import/import.status";

/**
 * @description DTO phản hồi chi tiết tiến độ xử lý của Job
 */
export interface IImportJobStatusResponseDTO {
  
  jobId: string;
  status: ImportStatus;
  progress: number; // Phần trăm từ 0-100
  metadata: {
    totalRows: number;
    processedRows: number;
    successCount: number;
    errorCount: number;
  };
  errors: Array<{
    row: number;
    column: string;
    message: string;
  }>;
  currentStep: string;
  lastError: string;
}