import { Request, Response } from 'express';
import { CreateExamMatrixDTO } from '@/application/dtos/request/exam-matrix/create-exam-matrix.dto';
import { UpdateExamMatrixDTO } from '@/application/dtos/request/exam-matrix/update-exam-matrix.dto';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { IExamMatrixService } from '@/domain/interfaces/services/i-exam-matrix.service';

/**
 * @interface IExamMatrixControllerCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Exam Matrix Controller.
 * Chứa Service để điều phối các luồng nghiệp vụ chính.
 */
export interface IExamMatrixControllerCradle {
    examMatrixService: IExamMatrixService;
}

/**
 * @class ExamMatrixController
 * @description Controller xử lý các yêu cầu HTTP liên quan đến Ma trận đề thi (Exam Matrix).
 * Đóng vai trò là "cửa ngõ" tiếp nhận data từ Client và trả về phản hồi chuẩn hóa.
 */
export class ExamMatrixController {
    private readonly _matrixService: IExamMatrixService;

    /**
     * @description Khởi tạo Controller với "vũ khí" Service được "tiêm" từ DI Container.
     * @param {IExamMatrixControllerCradle} cradle - Chứa ExamMatrixService.
     */
    constructor({ examMatrixService }: IExamMatrixControllerCradle) {
        this._matrixService = examMatrixService;
    }

    /**
     * @description Tiếp nhận yêu cầu tạo mới một ma trận đề thi.
     * @route POST /api/v1/exam-matrices
     * @param {Request} req - Chứa CreateExamMatrixDTO trong body.
     * @param {Response} res - Phản hồi tiêu chuẩn.
     * @returns {Promise<void>}
     */
    public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const dto = new CreateExamMatrixDTO(req.body);
        // Tự validate input trước khi xuống Service
        dto.isValid();

        const data = await this._matrixService.create(dto);

        Result.ok(
            res,
            data,
            Message.MATRIX.CREATE_SUCCESS,
            'MATRIX_CREATE_SUCCESS'
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

        const data = await this._matrixService.getById(id);

        Result.ok(
            res,
            data,
            Message.MATRIX.FETCH_SUCCESS,
            'MATRIX_FETCH_SUCCESS'
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
        const dto = new UpdateExamMatrixDTO(req.body);

        dto.isValid();

        const data = await this._matrixService.update(id, dto);

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

        await this._matrixService.delete(id);

        Result.ok(
            res,
            undefined,
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
        const data = await this._matrixService.restore(id);

        Result.ok(res, data, Message.MATRIX.RESTORE_SUCCESS, 'MATRIX_RESTORE_SUCCESS');
    });
}