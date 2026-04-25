import { stat } from 'node:fs/promises';
import { ImportJobEntity } from '@/domain/entities/import/import-job.entity';
import { AppError, ErrorCode } from '@/shared/errors';
import { IImportJobRepository } from '@/domain/interfaces/repositories/integration/i-import-job.repository';
import { ITempStorageService } from '@/domain/interfaces/external/i-temp-storage.service';
import { ImportMapper } from '@/infrastructure/database/mappers/integration/import.mapper';
import { IImportService } from '@/domain/interfaces/services/integration/i-import.service';
import { IImportQueue } from '@/domain/interfaces/queues/i-import.queue';
import { InitImportRequestDto, UploadChunkRequestDto, CompleteImportRequestDto } from '@/application/dtos/request/import/import.dto';
import { IImportJobResponseDTO } from '@/application/dtos/response/import/import-job.dto.respone';
import { IImportJobStatusResponseDTO } from '@/application/dtos/response/import/import-status-response.dto';

/**
 * @description Interface định nghĩa các phụ thuộc (Dịch: Service Dependencies)
 */
export interface IImportServiceCradle {
    importJobRepository: IImportJobRepository;
    tempStorageService: ITempStorageService;
    importQueue: IImportQueue;
}

/**
 * @description Application Service điều phối tiến trình Import 
 * (Dịch: Import Orchestration Application Service)
 */
export class ImportService implements IImportService {
    private readonly _importRepo: IImportJobRepository;
    private readonly _tempStorage: ITempStorageService;
    private readonly _importQueue: IImportQueue 

    constructor({
        importJobRepository,
        tempStorageService,
        importQueue,
    }: IImportServiceCradle) {
        this._importRepo = importJobRepository;
        this._tempStorage = tempStorageService;
        this._importQueue = importQueue;
    }

    /**
     * @description Bước 1: Khởi tạo phiên làm việc (Dịch: Initialize Import Session)
     * @param {InitImportRequestDto} dto - Dữ liệu yêu cầu từ Client
     * @returns {Promise<IImportJobResponseDTO>}
     */
    public async initSession(dto: InitImportRequestDto): Promise<IImportJobResponseDTO> {
        // 1. Khởi tạo Entity (Dịch: Initialize Rich Domain Model Entity)
        // Tính toán số lượng mảnh cần thiết dựa trên cấu hình hệ thống
        const entity = ImportJobEntity.create({
            fileName: dto.fileName,
            totalSize: dto.totalSize,
        });

        // 2. Lưu trữ vào Database (Dịch: Persist to Database via Repository)
        const savedJob = await this._importRepo.createImportJob(entity);

        // 3. Khởi tạo hạ tầng lưu trữ tạm (Dịch: Initialize Temporary Storage)
        // Đảm bảo Job ID tồn tại sau khi lưu để tạo thư mục vật lý
        if (!savedJob.id) {
            throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR, "Job ID generation failed.");
        }

        await this._tempStorage.createTempDir(savedJob.id);

        // 4. Trả về DTO thông qua Mapper chuẩn (Dịch: Return DTO via Mapper)
        return ImportMapper.toResponse(savedJob);
    }

    /**
     * @description Bước 2: Lưu trữ mảnh file (Chunk) vào bộ nhớ tạm
     * @param {UploadChunkRequestDto} dto - Dữ liệu chứa jobId và index của mảnh
     * @param {Buffer} chunkBuffer - Dữ liệu nhị phân của mảnh file
     * @returns {Promise<void>}
     */
    public async saveChunk(dto: UploadChunkRequestDto, chunkBuffer: Buffer): Promise<void> {
        // 1. Tìm kiếm thực thể từ Repository
        const job = await this._importRepo.findById(dto.jobId);

        // 2. Kiểm tra tồn tại
        if (!job) {
            throw new AppError(ErrorCode.IMPORT.JOB_NOT_FOUND);
        }

        // 3. Sử dụng Rich Logic của Entity để Validation (Xác thực trạng thái và kích thước)
        if (!job.isPending()) {
            throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
        }

        // Ném lỗi trực tiếp từ Entity nếu kích thước không hợp lệ
        job.validateChunkSize(chunkBuffer.length);

        // 4. Kiểm tra thời hạn phiên làm việc (Expiration check)
        if (job.isExpired()) {
            await this._tempStorage.cleanup(job.id!);
            throw new AppError(ErrorCode.IMPORT.SESSION_EXPIRED);
        }

        // 5. Giao phó việc lưu mảnh vật lý cho tầng Infrastructure (Hạ tầng)
        await this._tempStorage.saveChunk(job.id!, dto.index, chunkBuffer);
    }

    /**
     * @description Bước 3: Gộp file, xử lý nghiệp vụ và dọn dẹp
     */
    public async completeProcess(dto: CompleteImportRequestDto): Promise<void> {
        const job = await this._importRepo.findById(dto.jobId);

        // 1. Kiểm tra sự tồn tại của Job
        if (!job) throw new AppError(ErrorCode.IMPORT.JOB_NOT_FOUND);

        // 2. Kiểm tra nghiệp vụ tại Entity 
        if (!job.canComplete()) {
            throw new AppError(ErrorCode.IMPORT.JOB_INVALID_STATUS);
        }

        // 3. Gộp mảnh thành file hoàn chỉnh (Merge chunks)
        // Nếu merge lỗi, hàm này sẽ tự throw Error của hệ điều hành/fs
        const finalZipPath = await this._tempStorage.mergeChunks(job.id!, job.totalChunks);

        // 4. Kiểm tra tính toàn vẹn (File size validation)
        const stats = await stat(finalZipPath);
        if (stats.size !== job.props.totalSize) {
            // Dọn dẹp folder chứa các chunk rác ngay lập tức
            await this._tempStorage.cleanup(job.id!);
            throw new AppError(ErrorCode.IMPORT.EXTRACT_FAILED, 'File bị lỗi trong quá trình upload hoặc gộp');
        }

        // 5. Chuyển trạng thái sang QUEUED (Đã vào hàng đợi)
        job.markAsQueued();
        await this._importRepo.updateImportJob(job);

        // 6. Đẩy vào BullMQ
        // Nếu Redis sập, dòng này sẽ throw Error và cả request này sẽ trả về lỗi 500
        await this._importQueue.addImportJob(job.id!, finalZipPath);
    }


    /**
     * @description Lấy trạng thái và tiến độ xử lý hiện tại (Polling API)
     * @param {string} jobId - ID của phiên làm việc
     * @returns {Promise<IImportJobStatusResponseDTO>} DTO chứa tiến độ chi tiết
     */
    public async getJobStatus(jobId: string): Promise<IImportJobStatusResponseDTO> {
        // 1. Tìm Job trong DB (Không dùng try-catch)

        if (!jobId) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        const jobRecord = await this._importRepo.findById(jobId);

        // 2. Nếu không thấy, ném lỗi nghiệp vụ (Để Global Handler xử lý)
        if (!jobRecord) {
            throw new AppError(ErrorCode.IMPORT.JOB_NOT_FOUND);
        }

        // 3. Map Record thô từ DB sang Rich Domain Entity
        return ImportMapper.toStatusResponse(jobRecord);
    }
}