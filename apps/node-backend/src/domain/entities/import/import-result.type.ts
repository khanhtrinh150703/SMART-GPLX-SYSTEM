import { Prisma } from "@prisma/client";

/**
 * @description Định nghĩa các bước cụ thể trong quy trình xử lý của Worker
 */
export type ImportStep =
  | 'QUEUED'           // Đang nằm trong hàng đợi
  | 'EXTRACTING'       // Đang giải nén ZIP
  | 'VALIDATING_EXCEL' // Đang kiểm tra cấu trúc Excel
  | 'UPLOADING_ASSETS' // Đang upload ảnh lên Storage
  | 'SAVING_DATABASE'  // Đang lưu dữ liệu vào MySQL
  | 'COMPLETED'        // Hoàn thành
  | 'FAILED'         // Thất bại
  | 'PROCESSING'       // Đang xử lý từng dòng

/**
 * @description Chi tiết lỗi trên từng ô dữ liệu
 */
export interface IImportError extends Prisma.JsonObject {
  row: number;         
  column?: string;  
  message: string;     
  details?: string[]; 
  timestamp: string;  
}

/**
 * @description Cấu trúc dữ liệu kết quả xử lý
 */
export interface IImportResultData extends Prisma.JsonObject {
  totalRows?: number;
  processedRows?: number;
  successCount: number;
  errorCount: number;
  errors: IImportError[];
  currentStep?: ImportStep;
  lastError?: string;
}