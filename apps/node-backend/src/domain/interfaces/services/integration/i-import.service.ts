import { CompleteImportRequestDTO, InitImportRequestDTO, UploadChunkRequestDTO } from '@/application/dtos/request/import/import.dto';
import { IImportJobResponseDTO } from '@/application/dtos/response/import/import-job.dto.respone';
import { IImportJobStatusResponseDTO } from '@/application/dtos/response/import/import-status-response.dto';

/**
 * @interface IImportService
 * @description Application Service điều phối quy trình Import dữ liệu thông qua cơ chế Chunked Upload.
 */
export interface IImportService {
    /**
     * @description Bước 1: Khởi tạo phiên làm việc, tạo Job ID và chuẩn bị tài nguyên.
     * @param dto Thông tin cơ bản về file và cấu hình chunk.
     * @returns {Promise<InitImportRequestDTO>} Thông tin Job đã khởi tạo.
     */
    initSession(dto: InitImportRequestDTO): Promise<IImportJobResponseDTO>;

    /**
     * @description Bước 2: Lưu trữ từng mảnh file (Chunk) vào bộ nhớ tạm.
     * @param dto Thông tin định danh chunk và Job ID tương ứng.
     * @param chunkBuffer Dữ liệu nhị phân của mảnh file.
     */
    saveChunk(dto: UploadChunkRequestDTO, chunkBuffer: Buffer): Promise<void>;

    /**
     * @description Bước 3: Hợp nhất các mảnh file, giải nén và kích hoạt tiến trình xử lý nghiệp vụ ngầm.
     * @param dto Thông tin xác nhận hoàn tất việc upload các chunk.
     */
    completeProcess(dto: CompleteImportRequestDTO): Promise<void>;

    /**
     * @description Truy vấn trạng thái và tiến độ xử lý hiện tại của một Job.
     * @param jobId ID định danh của Job cần kiểm tra.
     * @returns {Promise<IImportJobStatusResponseDTO>} Trạng thái và dữ liệu kết quả (nếu có).
     */
    getJobStatus(jobId: string): Promise<IImportJobStatusResponseDTO>;
}