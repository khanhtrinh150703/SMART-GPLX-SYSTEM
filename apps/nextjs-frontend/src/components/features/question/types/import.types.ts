import { ImportStatus } from "./import.status";

/**
 * AssetInfo: Thông tin tệp tin đa phương tiện đính kèm
 */
export interface AssetInfo {
  file: File;
  url: string;
}

/**
 * ImportSessionResponse: Phản hồi khi khởi tạo phiên upload
 */
export interface ImportSessionResponse {
  jobId: string; // Mã định danh công việc (Dịch: Job Identifier)
}

/**
 * ImportFinalResponse: Phản hồi khi hoàn tất quá trình import
 */
export interface ImportFinalResponse {
  jobId: string;
  totalImported: number; // Tổng số câu hỏi đã nhập thành công
  errors?: string[];     // Danh sách các lỗi nếu có (Partial Success)
}

/**
 * ImportMutationParams: Tham số truyền vào Hook React Query
 */
export interface ImportMutationParams {
  excelFile: File;
  assetMap: Map<string, AssetInfo>;
}

export interface IImportJobStatusDTO {
  jobId: string;
  status: ImportStatus;
  // Tỷ lệ phần trăm tổng quát (Dịch: General progress percentage)
  progress: number;

  // Chi tiết xử lý để hiển thị UI (Dịch: Processing details)
  metadata: {
    totalRows: number;      // Tổng số câu hỏi trong file Excel
    processedRows: number;  // Số câu đã xử lý xong
    successCount: number;   // Số câu thành công
    errorCount: number;     // Số câu bị lỗi
  };

  // Danh sách lỗi chi tiết (Dịch: Detailed error logs)
  // Rất quan trọng để người dùng biết câu nào lỗi, lỗi gì (ví dụ: thiếu ảnh row 5)
  errors?: Array<{
    row: number;
    column?: string;
    message: string;
  }>;
}

/**
 * @description Data Transfer Object for Import Job Initialization Response
 * (Đối tượng chuyển đổi dữ liệu cho phản hồi khởi tạo công việc nhập dữ liệu)
 */
export interface IImportJobResponseDTO {
  /** * @description Unique identifier for the import job 
   * (Mã định danh duy nhất cho công việc nhập dữ liệu) 
   */
  jobId: string;

  /** * @description Original name of the uploaded file 
   * (Tên gốc của tệp tin được tải lên) 
   */
  fileName: string;

  /** * @description Current status of the job (e.g., PENDING) 
   * (Trạng thái hiện tại của công việc) 
   */
  status: ImportStatus;

  /** * @description Optional message from the server 
   * (Thông báo tùy chọn từ máy chủ) 
   */
  message?: string;

  /** * @description Maximum size allowed for each chunk in bytes (e.g., 5242880 for 5MB)
   * (Kích thước tối đa cho phép của mỗi mảnh tính bằng byte) 
   */
  chunkSizeLimit: number;

  /** * @description Total number of chunks the server expects to receive
   * (Tổng số mảnh mà máy chủ mong đợi nhận được) 
   */
  expectedChunks: number;

  /** * @description ISO string representing when this session will expire
   * (Chuỗi định dạng ISO đại diện cho thời điểm phiên làm việc này hết hạn) 
   */
  expiresAt: string;

  /** * @description Additional dynamic data for progress tracking (Optional)
   * (Dữ liệu động bổ sung để theo dõi tiến độ - Tùy chọn) 
   */
  progressData?: Record<string, unknown>;
}

export interface IApiImportError {
  row: number;
  column?: string | null; // Có thể null hoặc không tồn tại (Optional)
  message: string;
  timestamp?: string;
}

export interface IImportError {
  row: number;
  column: string;
  message: string;
  // Chuyển sang string để tương thích 100% với Prisma.JsonObject
  // (Change to string for 100% compatibility with Prisma.JsonObject)
  timestamp: string; 
}