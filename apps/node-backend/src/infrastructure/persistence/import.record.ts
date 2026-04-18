import { IImportResultData } from "@/domain/entities/import/import-result.type";

/**
 * @description Đại diện cho cấu trúc dữ liệu trong Database (Prisma).
 * Toàn bộ các trường sử dụng camelCase 100%.
 */
export interface IImportJobRecord {
  id: string;
  fileName: string;
  totalSize: number;
  totalChunks: number;
  chunkSizeLimit: number; // Đã bổ sung
  status: string;
  resultData: IImportResultData | null;
  expiresAt: Date;        // Đã bổ sung
  createdAt: Date;
  updatedAt: Date;
}