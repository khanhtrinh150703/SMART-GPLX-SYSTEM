import { ImportStatus } from "@/domain/entities/import/import.status";
import { IImportProgressResponseDTO } from "./import-progress.dto";

/**
 * @description Giao diện dữ liệu trả về cho trạng thái và cấu hình của phiên Import.
 * (Interface for the detailed status and configuration response of the Import session.)
 */
export interface IImportJobResponseDTO {
  /** @description Mã định danh duy nhất của công việc import (UUID). */
  readonly jobId: string;

  /** @description Tên tệp tin đang được xử lý. */
  readonly fileName: string;

  /** @description Trạng thái hiện tại của phiên làm việc. */
  readonly status: ImportStatus;

  /** @description Giới hạn kích thước mỗi mảnh (bytes) để Client thực hiện cắt file. */
  readonly chunkSizeLimit: number;

  /** @description Tổng số mảnh mà hệ thống mong đợi nhận được. */
  readonly expectedChunks: number;

  /** @description Thời điểm phiên làm việc hết hạn (định dạng ISO String). */
  readonly expiresAt: string;

  /** @description Thông báo trạng thái thân thiện cho người dùng. */
  readonly message?: string;

  /** @description Dữ liệu tiến độ chi tiết của quá trình xử lý. */
  readonly progressData: IImportProgressResponseDTO;
}

/**
 * @description DTO vận chuyển trạng thái phiên Import.
 * Đóng vai trò mang dữ liệu cấu hình Handshake và tiến độ chi tiết để phía Client điều chỉnh luồng upload.
 */
export class ImportJobResponseDTO implements IImportJobResponseDTO {
  public readonly jobId: string;
  public readonly fileName: string;
  public readonly status: ImportStatus;
  public readonly chunkSizeLimit: number;
  public readonly expectedChunks: number;
  public readonly expiresAt: string;
  public readonly message?: string;
  public readonly progressData: IImportProgressResponseDTO;

  constructor(data: IImportJobResponseDTO) {
    this.jobId = data.jobId;
    this.fileName = data.fileName;
    this.status = data.status;
    this.chunkSizeLimit = data.chunkSizeLimit;
    this.expectedChunks = data.expectedChunks;
    this.expiresAt = data.expiresAt;
    this.message = data.message;
    this.progressData = data.progressData;
  }
}