import { CompleteImportRequestDto, InitImportRequestDto, UploadChunkRequestDto } from '@/application/dtos/request/import/import.dto';
import { IImportJobResponseDTO } from '@/application/dtos/response/import/import-job.dto.respone';
import { IImportJobStatusResponseDTO } from '@/application/dtos/response/import/import-status-response.dto';
// import { IImportResultData } from '@/shared/types/import-result.type';

/**
 * @description Interface cho Application Service điều phối tiến trình Import 
 * (Dịch: Interface for Import Orchestration Application Service)
 */
export interface IImportService {
    /**
     * @description Bước 1: Khởi tạo phiên làm việc 
     * (Dịch: Step 1: Initialize Session)
     */
    initSession(dto: InitImportRequestDto): Promise<IImportJobResponseDTO>;

    /**
     * @description Bước 2: Lưu trữ mảnh file (Chunk) 
     * (Dịch: Step 2: Save File Chunk)
     */
    saveChunk(dto: UploadChunkRequestDto, chunkBuffer: Buffer): Promise<void>;

    /**
     * @description Bước 3: Gộp file, xử lý nghiệp vụ và dọn dẹp 
     * (Dịch: Step 3: Merge files, business processing, and cleanup)
     */
    completeProcess(dto: CompleteImportRequestDto): Promise<void>;


    getJobStatus(jobId: string): Promise<IImportJobStatusResponseDTO>;
}