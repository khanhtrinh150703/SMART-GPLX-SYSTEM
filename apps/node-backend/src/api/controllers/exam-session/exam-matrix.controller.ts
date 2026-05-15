import { Request, Response } from 'express';
import { CreateExamMatrixRequestDTO } from '@/application/dtos/request/exam-matrix/create-exam-matrix.request.dto';
import { UpdateExamMatrixRequestDTO } from '@/application/dtos/request/exam-matrix/update-exam-matrix.request.dto';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { IExamMatrixService } from '@/domain/interfaces/services/exam-session';
import { IExamMatrixQueryService } from '@/domain/interfaces/services/exam-session/queries';
import { ExamMatrixQueryDTO } from '@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto';

/**
 * @interface IExamMatrixControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) định nghĩa các phụ thuộc cần thiết để vận hành Ma trận đề thi (Exam Matrix).
 */
export interface IExamMatrixControllerCradle {
    /** @description Dịch vụ thực hiện các thay đổi cấu trúc ma trận (Tạo mới, cập nhật tỷ lệ câu hỏi). */
    examMatrixService: IExamMatrixService;

    /** @description Dịch vụ chuyên trách truy vấn cấu hình ma trận và các ràng buộc liên quan.  */
    examMatrixQueryService: IExamMatrixQueryService;
}

/**
 * @class ExamMatrixController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến việc thiết lập Ma trận đề thi.
 * @principle Blueprint Governance - Đảm bảo các quy tắc về số lượng câu hỏi, phân bổ chương và câu hỏi điểm liệt luôn tuân thủ đúng quy định của Tổng cục Đường bộ..
 */
export class ExamMatrixController {
    /** @private @readonly @description Instance xử lý logic nghiệp vụ thay đổi cấu hình ma trận. */
    private readonly _examMatrixService: IExamMatrixService;

    /** @private @readonly @description Instance xử lý các yêu cầu đọc và kiểm tra tham số ma trận. */
    private readonly _examMatrixQueryService: IExamMatrixQueryService;

    /**
     * @constructor
     * @description Khởi tạo ExamMatrixController bằng cách giải nén các "vũ khí" nghiệp vụ từ Cradle thông qua Awilix.
     * @param {IExamMatrixControllerCradle} cradle - Chứa các dịch vụ chuyên biệt để quản lý cấu trúc đề thi.
     */
    constructor({ examMatrixService, examMatrixQueryService }: IExamMatrixControllerCradle) {
        this._examMatrixService = examMatrixService;
        this._examMatrixQueryService = examMatrixQueryService;
    }

    /**
     * @description Tiếp nhận yêu cầu tạo mới một ma trận đề thi.
     * @route POST /api/v1/exam-matrices
     * @param {Request} req - Chứa CreateExamMatrixDTO trong body.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const dto = new CreateExamMatrixRequestDTO(req.body);
        // Tự validate input trước khi xuống Service
        const data = await this._examMatrixService.create(dto);

        Result.ok(
            res,
            data,
            Message.MATRIX.CREATE_SUCCESS,
            'MATRIX_CREATE_SUCCESS'
        );
    });

    /**
     * @description Cập nhật thông tin ma trận và thay thế các chi tiết chương.
     * @route PUT /api/v1/exam-matrices/:id
     * @param {Request} req - Chứa id trong params và UpdateExamMatrixDTO trong body.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const dto = new UpdateExamMatrixRequestDTO({ id, ...req.body });
        const data = await this._examMatrixService.update(id, dto);

        Result.ok(
            res,
            data,
            Message.MATRIX.UPDATE_SUCCESS,
            'MATRIX_UPDATE_SUCCESS'
        );
    });

    /**
     * @description Xóa thông minh ma trận (Smart Delete: Hard hoặc Soft tùy liên kết).
     * @route DELETE /api/v1/exam-matrices/:id
     * @param {Request} req - Chứa id trong params.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;

        const result = await this._examMatrixService.delete(id);

        Result.ok(
            res,
            result,
            Message.MATRIX.DELETE_SUCCESS,
            'MATRIX_DELETE_SUCCESS'
        );
    });

    /**
     * @description Khôi phục ma trận đề thi đã xóa mềm.
     * @route PATCH /api/v1/exam-matrices/:id/restore
     * @param {Request} req - Chứa id trong params.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public restore = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;
        const data = await this._examMatrixService.restore(id);

        Result.ok(res, data, Message.MATRIX.RESTORE_SUCCESS, 'MATRIX_RESTORE_SUCCESS');
    });

    /**
    * @description Truy vấn danh sách toàn bộ ma trận đề thi trong hệ thống.
    * @route GET /api/v1/exam-matrices
    * @returns {Promise<void>} Phản hồi danh sách ExamMatrixResponseDTO.
    */
    public list = catchAsync(async (req: Request, res: Response): Promise<void> => {
        // Khởi tạo DTO từ query params với cơ chế Self-validating
        const query = new ExamMatrixQueryDTO(req.query as Record<string, unknown>);

        const response = await this._examMatrixQueryService.getPaginatedExamMatrices(query);

        // Trả về Standard Response sử dụng Result Pattern
        Result.ok(
            res,
            response,
            Message.MATRIX.FETCH_SUCCESS,
            'EXAM_MATRIX_GET_SUCCESS'
        );
    });

    /**
     * @description Lấy chi tiết một ma trận đề thi theo ID.
     * @route GET /api/v1/exam-matrices/:id
     * @param {Request} req - Chứa id trong params.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id as string;

        const data = await this._examMatrixQueryService.getDetail(id);
        Result.ok(
            res,
            data,
            Message.MATRIX.FETCH_SUCCESS,
            'MATRIX_FETCH_SUCCESS'
        );
    });

    /**
     * @description Lấy danh sách các ma trận đề thi định dạng selection (value/label) hỗ trợ hiển thị trên UI.
     * @route GET /api/v1/exams/matrices/selection
     * @param {Request} _req - Đối tượng Request của Express.
     * @param {Response} res - Đối tượng Response của Express.
     * @returns {Promise<void>} Phản hồi danh sách ma trận dạng { items, meta }.
     */
    public getExamMatrixSelections = catchAsync(async (_req: Request, res: Response) => {
        // Gọi service để lấy danh sách ma trận (thường đã qua Mapper.toSelectionList và sort theo createdAt)
        const result = await this._examMatrixQueryService.getExamMatrixSelections();
        Result.ok(
            res,
            result,
            Message.EXAM.FETCH_SUCCESS, 
            'EXAM_MATRIX_SELECTION_SUCCESS'
        );
    });
}