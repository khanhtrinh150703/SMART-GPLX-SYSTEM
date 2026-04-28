import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description DTO cho Endpoint 1: Init Session (Dịch: Initialize Session DTO)
 */
export class InitImportRequestDto {
    public readonly fileName: string;
    public readonly totalSize: number;
    public readonly totalChunks: number;

    constructor(body: unknown) {
        // Kiểm tra xem body có phải là object không (Dịch: Type guarding for object)
        const data = (body && typeof body === 'object') ? (body as Record<string, unknown>) : {};

        this.fileName = typeof data.fileName === 'string' ? data.fileName : '';
        
        // Chuyển đổi sang number đề phòng trường hợp nhận từ form-data là string
        // (Dịch: Safe numeric conversion)
        this.totalSize = Number(data.totalSize) || 0;
        this.totalChunks = Number(data.totalChunks) || 0;
    }

    public isValid(): void {
        if (!this.fileName || this.totalSize <= 0 || this.totalChunks <= 0) {
            throw new AppError(ErrorCode.VALIDATION.REQUIRED);
        }
    }
}

/**
 * @description DTO cho Endpoint 2: Upload Chunk
 */
/**
 * @description DTO cho Endpoint 2: Upload Chunk (Dịch: Upload file chunk DTO)
 */
export class UploadChunkRequestDto {
    public readonly jobId: string;
    public readonly index: number;

    constructor(body: unknown) {
        const data = (body && typeof body === 'object') ? (body as Record<string, unknown>) : {};

        this.jobId = typeof data.jobId === 'string' ? data.jobId : '';
        
        // Luôn ép kiểu number vì Multer fields thường là string (Dịch: Numeric indexing)
        this.index = data.index !== undefined ? Number(data.index) : -1;
    }

    public isValid(): void {
        if (!this.jobId) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        if (this.index < 0) {
            throw new AppError(ErrorCode.IMPORT.INVALID_CHUNK_INDEX);
        }
    }
}


/**
 * @description DTO cho Endpoint 3: Complete & Process
 */
export class CompleteImportRequestDto {
    public readonly jobId: string;

    constructor(body: unknown) {
        const data = (body && typeof body === 'object') ? (body as Record<string, unknown>) : {};

        this.jobId = typeof data.jobId === 'string' ? data.jobId : '';
    }

    public isValid(): void {
        if (!this.jobId) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }
    }
}