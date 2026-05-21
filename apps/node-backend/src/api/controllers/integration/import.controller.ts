import {
  CompleteImportRequestDTO,
  InitImportRequestDTO,
  UploadChunkRequestDTO,
} from "@/application/dtos/request/import/import.dto";
import { IImportService } from "@/domain/interfaces/services/integration";
import { AppError, ErrorCode } from "@/shared/errors";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Request, Response } from "express";

/**
 * @interface IImportControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) chứa các dịch vụ cần thiết để vận hành luồng nhập dữ liệu hàng loạt (Bulk Import).
 * @guard Interface Segregation - Đảm bảo Controller chỉ tiếp cận đúng dịch vụ Import, tuân thủ nguyên tắc phân tách giao diện.
 */
export interface IImportControllerCradle {
  /** @description Dịch vụ xử lý logic giải nén, đọc file Excel và chuyển đổi dữ liệu vào DB.*/
  importService: IImportService;
}

/**
 * @class ImportController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến việc nhập dữ liệu từ tệp tin bên ngoài.
 * @principle Boundary Control - Đóng vai trò là cửa ngõ tiếp nhận các tệp tin thô (Multipart/form-data) và điều phối chúng vào quy trình xử lý của tầng Application.
 */
export class ImportController {
  /** @private @readonly @description Instance chuyên trách xử lý luồng nghiệp vụ Import câu hỏi/dữ liệu. */
  private readonly _importService: IImportService;

  /**
   * @constructor
   * @description Khởi tạo ImportController bằng cách giải nén các phụ thuộc từ Cradle thông qua Awilix.
   * @param {IImportControllerCradle} cradle - Chứa các dịch vụ chuyên biệt cần thiết để xử lý tệp tin.
   */
  constructor({ importService }: IImportControllerCradle) {
    // Tuân thủ triết lý: Chỉ nhận những gì tối cần thiết để giảm thiểu sự phụ thuộc (Tight Coupling).
    this._importService = importService;
  }

  /**
   * @description [POST] API 1: Khởi tạo phiên làm việc để chuẩn bị upload tệp tin.
   * @route /api/v1/import/init
   * @param {Request} req - Chứa body là InitImportRequestDto.
   * @returns {Promise<void>}
   */
  public init = catchAsync(async (req: Request, res: Response) => {
    // 1. Khởi tạo DTO từ dữ liệu multipart (Dịch: Initialize DTO from multipart data)
    const dto = new InitImportRequestDTO(req.body);

    // 2. Truyền dto vào service - Không còn lỗi "any" nữa
    const job = await this._importService.initSession(dto);
    Result.ok(res, job, Message.IMPORT.INIT_SUCCESS, "INIT_SUCCESS");
  });

  /**
   * @description [POST] API 2: Tải lên từng mảnh (chunk) của tệp tin.
   * @route /api/v1/import/upload-chunk
   * @param {Request} req - Chứa body (jobId, index) và file (multer chunk).
   * @returns {Promise<void>}
   */
  public uploadChunk = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;

    // 1. Khởi tạo DTO từ req.body (Loại bỏ hoàn toàn any nhờ constructor đã viết)
    const dto = new UploadChunkRequestDTO(req.body);

    // 2. Chạy logic xác thực dữ liệu ngay lập tức

    // 3. Kiểm tra tệp tin mảnh từ Multer
    if (!file) {
      throw new AppError(ErrorCode.IMPORT.FILE_MISSING);
    }

    // 4. Truyền thẳng dto vào service thay vì tạo object literal mới
    const result = await this._importService.saveChunk(dto, file.buffer);

    Result.ok(
      res,
      result,
      Message.IMPORT.CHUNK_UPLOAD_SUCCESS(dto.index),
      "CHUNK_UPLOAD_SUCCESS",
    );
  });

  /**
   * @description [POST] API 3: Hoàn tất quá trình tải lên và đưa Job vào hàng đợi xử lý.
   * @route /api/v1/import/complete
   * @param {Request} req - Chứa body là CompleteImportRequestDto (jobId).
   * @returns {Promise<void>}
   */
  public complete = catchAsync(async (req: Request, res: Response) => {
    // 1. Khởi tạo DTO từ req.body (Dịch: Initialize DTO from req.body)
    // Không sử dụng any nhờ vào việc ép kiểu an toàn trong constructor của DTO
    const dto = new CompleteImportRequestDTO(req.body);

    // 2. Tự xác thực dữ liệu (Dịch: Self-validation)
    // Ném lỗi ngay lập tức nếu không có jobId hợp lệ

    // 3. Gọi service để thực hiện gộp file và đẩy vào hàng đợi (Dịch: Process and Queue)
    await this._importService.completeProcess(dto);

    // 4. Phản hồi thành công (Dịch: Success response)
    Result.ok(
      res,
      { jobId: dto.jobId, status: "QUEUED" },
      Message.IMPORT.COMPLETE_SUCCESS,
      "COMPLETE_SUCCESS",
    );
  });

  /**
   * @description [GET] API Polling: Lấy trạng thái tiến độ và kết quả hiện tại của Job.
   * @route /api/v1/import/status/:jobId
   * @param {Request} req - Chứa params.jobId là ID của phiên Import.
   * @returns {Promise<void>}
   */
  public getStatus = catchAsync(async (req: Request, res: Response) => {
    const jobId = req.params.jobId as string;

    const status = await this._importService.getJobStatus(jobId);

    Result.ok(res, status, Message.IMPORT.STATUS_SUCCESS, "STATUS_SUCCESS");
  });
}
