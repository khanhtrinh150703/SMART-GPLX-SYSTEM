import { AppError, ErrorCode } from "@/shared/errors";

export interface IInitImportInputDTO {
    readonly fileName: string;
    readonly totalSize: number;
    readonly totalChunks: number;
}

export class InitImportRequestDTO implements IInitImportInputDTO {
    public readonly fileName: string;
    public readonly totalSize: number;
    public readonly totalChunks: number;

    constructor(data: IInitImportInputDTO) {
        this.validate(data);

        this.fileName = data.fileName.trim();
        this.totalSize = Number(data.totalSize);
        this.totalChunks = Number(data.totalChunks);
    }

    private validate(data: IInitImportInputDTO): void {
        if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

        // 1. Kiểm tra tên tệp
        if (!data.fileName || data.fileName.trim() === '') {
            throw new AppError(ErrorCode.IMPORT.FILE_NAME_REQUIRED);
        }

        // 2. Kiểm tra kích thước tệp (phải lớn hơn 0)
        if (!data.totalSize || Number(data.totalSize) <= 0) {
            throw new AppError(ErrorCode.IMPORT.INVALID_TOTAL_SIZE);
        }

        // 3. Kiểm tra số lượng mảnh (phải lớn hơn 0)
        if (!data.totalChunks || Number(data.totalChunks) <= 0) {
            throw new AppError(ErrorCode.IMPORT.INVALID_TOTAL_CHUNKS);
        }
    }
}

export interface IUploadChunkInputDTO {
    readonly jobId: string;
    readonly index: number;
}

export class UploadChunkRequestDTO implements IUploadChunkInputDTO {
    public readonly jobId: string;
    public readonly index: number;

    constructor(data: IUploadChunkInputDTO) {
        this.validate(data);

        this.jobId = data.jobId.trim();
        this.index = Number(data.index);
    }

    private validate(data: IUploadChunkInputDTO): void {
        if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

        // 1. Kiểm tra Job ID
        if (!data.jobId || data.jobId.trim() === '') {
            throw new AppError(ErrorCode.IMPORT.JOB_ID_REQUIRED);
        }

        // 2. Kiểm tra Index (Chấp nhận giá trị 0)
        if (
            data.index === undefined ||
            data.index === null ||
            isNaN(Number(data.index)) ||
            Number(data.index) < 0
        ) {
            throw new AppError(ErrorCode.IMPORT.INVALID_CHUNK_INDEX);
        }
    }
}


export interface ICompleteImportInputDTO {
    readonly jobId: string;
}

export class CompleteImportRequestDTO implements ICompleteImportInputDTO {
    public readonly jobId: string;

    constructor(data: ICompleteImportInputDTO) {
        this.validate(data);
        this.jobId = data.jobId.trim();
    }

    private validate(data: ICompleteImportInputDTO): void {
        // 1. Kiểm tra object data
        if (!data) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
        }

        // 2. Kiểm tra Job ID
        if (!data.jobId || data.jobId.trim() === '') {
            throw new AppError(ErrorCode.IMPORT.JOB_ID_REQUIRED);
        }
    }
}