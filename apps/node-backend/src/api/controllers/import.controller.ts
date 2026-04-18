// api/controllers/import.controller.ts
import { CompleteImportRequestDto, InitImportRequestDto, UploadChunkRequestDto } from '@/application/dtos/request/import/import.dto';
import { IImportService } from '@/domain/interfaces/services/i-import.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Request, Response } from 'express';

/**
 * @description Interface định nghĩa các phụ thuộc cho ImportController (Dịch: Controller Dependencies)
 */
export interface IImportControllerCradle {
    importService: IImportService;
}

export class ImportController {
    private readonly _importService: IImportService;

    /**
     * @description Khởi tạo ImportController với các phụ thuộc chuyên biệt.
     * (Dịch: Initializes ImportController with specialized dependencies.)
     * @param {IImportControllerCradle} cradle - Dependencies được tiêm tự động từ DI Container.
     */
    constructor({ importService }: IImportControllerCradle) {
        // CHỈ NHẬN NHỮNG THỨ CẦN THIẾT CHO IMPORT
        this._importService = importService;
    }

    /**
     * @description API 1: Khởi tạo phiên làm việc (Dịch: Initialize Import Session)
     */
    public init = catchAsync(async (req: Request, res: Response) => {
        // Lưu ý: Bạn nên gửi thêm fileName và totalChunks từ FE
        // 1. Khởi tạo DTO từ dữ liệu multipart (Dịch: Initialize DTO from multipart data)
        const dto = new InitImportRequestDto(req.body);

        // 2. Truyền dto vào service - Không còn lỗi "any" nữa
        const job = await this._importService.initSession(dto);
        Result.ok(
            res,
            job,
            Message.IMPORT.INIT_SUCCESS,
            'INIT_SUCCESS'
        );
    });

    /**
     * @description API 2: Tải lên từng mảnh (Dịch: Upload file chunk)
     */
    public uploadChunk = catchAsync(async (req: Request, res: Response) => {
        const file = req.file;

        // 1. Khởi tạo DTO từ req.body (Loại bỏ hoàn toàn any nhờ constructor đã viết)
        // (Dịch: Initialize DTO from req.body)
        const dto = new UploadChunkRequestDto(req.body);

        // 2. Chạy logic xác thực dữ liệu ngay lập tức
        // (Dịch: Execute self-validation logic)
        dto.isValid();

        // 3. Kiểm tra tệp tin mảnh từ Multer
        // (Dịch: Check for chunk file existence)
        if (!file) {
            throw new AppError(ErrorCode.IMPORT.FILE_MISSING);
        }

        // 4. Truyền thẳng dto vào service thay vì tạo object literal mới
        // (Dịch: Pass the DTO instance directly to the service)
        await this._importService.saveChunk(dto, file.buffer);
        Result.ok(
            res,
            null,
            Message.IMPORT.CHUNK_UPLOAD_SUCCESS(dto.index),
            'CHUNK_UPLOAD_SUCCESS'
        );
    });

    /**
     * @description API 3: Hoàn tất và đưa vào hàng đợi (Dịch: Complete and Queue)
     */
    public complete = catchAsync(async (req: Request, res: Response) => {
        // 1. Khởi tạo DTO từ req.body (Dịch: Initialize DTO from req.body)
        // Không sử dụng any nhờ vào việc ép kiểu an toàn trong constructor của DTO
        const dto = new CompleteImportRequestDto(req.body);

        // 2. Tự xác thực dữ liệu (Dịch: Self-validation)
        // Ném lỗi ngay lập tức nếu không có jobId hợp lệ
        dto.isValid();

        // 3. Gọi service để thực hiện gộp file và đẩy vào hàng đợi (Dịch: Process and Queue)
        await this._importService.completeProcess(dto);

        // 4. Phản hồi thành công (Dịch: Success response)
        Result.ok(
            res,
            { jobId: dto.jobId, status: 'QUEUED' },
            Message.IMPORT.COMPLETE_SUCCESS,
            'COMPLETE_SUCCESS'
        );
    });

    /**
     * @description API Polling: Lấy trạng thái tiến độ hiện tại
     * @route GET /api/v1/import/status/:jobId
     */
    public getStatus = catchAsync(async (req: Request, res: Response) => {
        const jobId = req.params.jobId as string;

        const status = await this._importService.getJobStatus(jobId);

        Result.ok(res, status, Message.IMPORT.STATUS_SUCCESS, "STATUS_SUCCESS");
    });

}