import { ImportStatus } from "@/domain/entities/import/import.status";
import { IImportProgressDTO } from "./import-progress.dto";

/**
 * @description DTO phản hồi chi tiết trạng thái và cấu hình của phiên Import.
 * Dùng để FE điều chỉnh luồng upload chunk và hiển thị tiến độ.
 */
/**
 * @description DTO phản hồi chi tiết trạng thái và cấu hình của phiên Import.
 * Cấu trúc này đảm bảo FE luôn biết hệ thống đang ở đâu, không còn "im lặng".
 */
export interface IImportJobResponseDTO {
  jobId: string;
  fileName: string;
  status: ImportStatus;
  
  // --- Cấu hình Handshake cho FE ---
  /** @description Giới hạn kích thước mỗi mảnh (bytes) để FE cắt file */
  chunkSizeLimit: number;
  /** @description Tổng số mảnh BE mong đợi nhận được */
  expectedChunks: number;
  /** @description Thời điểm phiên làm việc hết hạn (ISO String) */
  expiresAt: string;
  
  // --- Dữ liệu tiến độ (Hết im lặng) ---
  /** @description Thông báo trạng thái thân thiện bằng tiếng Việt */
  message?: string;
  /** @description Dữ liệu tiến độ chi tiết - Đã được ép kiểu chặt chẽ (Strict) */
  progressData: IImportProgressDTO;
}