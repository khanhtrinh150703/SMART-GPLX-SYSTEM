import { CreateManualExamRequestDTO, ICreateManualExamInputDTO } from '@/application/dtos/request/exam/create-exam-manual.request.dto';
import { ExamQueryDTO } from '@/application/dtos/request/exam/exam-query.request.dto';
import { GenerateExamDTO } from '@/application/dtos/request/exam/generate-exam.request.dto';
import { IUpdateExamInputDTO, UpdateExamRequestDTO } from '@/application/dtos/request/exam/update-exam.request.dto';
import { IExamGeneratorService } from '@/domain/interfaces/services/exam-engine';
import { IExamService } from '@/domain/interfaces/services/exam-mgmt';
import { IExamQueryService } from '@/domain/interfaces/services/exam-mgmt/queries';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/application/dtos/response/shared/api.response.dto';

import { IAuthRequest } from '@/shared/types/authRequest.types';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Response } from 'express';
import { ExamUserQueryDTO } from '@/application/dtos/request/exam/exam-query-list.request.dto';

/**
 * @interface IExamControllerCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho việc điều phối nghiệp vụ Bài thi.
 */
export interface IExamControllerCradle {
    /** @description Dịch vụ quản lý vòng đời bài thi (Nộp bài, chấm điểm, xóa). */
    examService: IExamService;

    /** @description Dịch vụ chuyên trách logic sinh đề thi tự động từ ma trận câu hỏi. */
    examGeneratorService: IExamGeneratorService;

    /** @description Dịch vụ cung cấp các khả năng truy vấn và thống kê dữ liệu bài thi.  */
    examQueryService: IExamQueryService;
}

/**
 * @class ExamController
 * @description Lớp điều phối các yêu cầu HTTP (Entry point) cho module Bài thi.
 * @principle Orchestration Excellence - Kết hợp giữa việc truy vấn dữ liệu có sẵn, sinh đề mới và quản lý trạng thái bài làm của thí sinh. .
 */
export class ExamController {
    /** @private @readonly @description Instance xử lý các logic ghi/nộp bài thi. */
    private readonly _examService: IExamService;

    /** @private @readonly @description Instance điều phối quy trình sinh đề thi. */
    private readonly _examGeneratorService: IExamGeneratorService;

    /** @private @readonly @description Instance xử lý các yêu cầu đọc và thống kê bài thi. */
    private readonly _examQueryService: IExamQueryService;

    /**
     * @constructor
     * @description Khởi tạo ExamController thông qua cơ chế Dependency Injection (Cradle).
     * @param {IExamControllerCradle} cradle - Chứa các dịch vụ Application cần thiết để xử lý luồng thi cử.
     */
    constructor({ examService, examGeneratorService, examQueryService }: IExamControllerCradle) {
        this._examService = examService;
        this._examGeneratorService = examGeneratorService;
        this._examQueryService = examQueryService;
    }

    /**
     * @description Truy vấn danh sách bộ đề thi có phân trang và lọc theo tiêu chí.
     * @route GET /api/v1/exams
     * @returns {Promise<void>} Phản hồi IExamSummaryResponseDTO kèm Metadata phân trang.
     */
    public getExams = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Khởi tạo Query DTO từ req.query (Ép kiểu unknown để Zero Any)
        const query = new ExamUserQueryDTO(req.query as Record<string, unknown>);
        // 2. Gọi Service xử lý nghiệp vụ phân trang
        const response = await this._examQueryService.getPaginatedVisualExams(query);
        
        // 3. Trả về kết quả theo Standard Response
        Result.ok(
            res,
            response,
            Message.EXAM.FETCH_SUCCESS,
            'EXAM_LIST_GET_SUCCESS'
        );
    });

    /**
     * @description Lấy thông tin chi tiết và danh sách câu hỏi của một bộ đề theo ID.
     * @route GET /api/v1/exams/:id
     * @returns {Promise<void>} Phản hồi IExamFullContentResponseDTO.
     */
    public getDetail = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Lấy ID từ params (Validation đã được xử lý ở tầng middleware hoặc Service)
        const id = req.params.id as string;

        // 2. Gọi Service bốc dữ liệu chi tiết (Eager Loading)
        const response = await this._examQueryService.getExamDetail(id);

        // 3. Trả về kết quả thành công
        Result.ok(
            res,
            response,
            Message.EXAM.DETAIL_SUCCESS,
            'EXAM_DETAIL_GET_SUCCESS'
        );
    });

    /**
     * @description Truy vấn danh sách toàn bộ đề thi trong hệ thống.
     * @route GET /api/v1/exams
     * @returns {Promise<void>} Phản hồi danh sách ExamResponseDTO kèm Metadata phân trang.
     */
    public list = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Khởi tạo Query DTO từ req.query (Zero Any - ép kiểu unknown)
        const query = new ExamQueryDTO(req.query as Record<string, unknown>);
        // 2. Gọi Service xử lý nghiệp vụ
        const response = await this._examQueryService.getPaginatedExams(query);
        // 3. Trả về kết quả theo Standard Response
        Result.ok(
            res,
            response,
            Message.EXAM.FETCH_SUCCESS,
            'EXAM_GET_SUCCESS'
        );
    });

    /**
     * @description API khởi tạo một bài thi mới (Bốc đề) dựa trên Ma trận cấu hình.
     * @route POST /api/v1/exams/generate
     * @param {Request} req - Chứa matrixId trong body. userId lấy từ Token đã qua Middleware.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi IExamResponse chứa snapshot đề thi.
     */
    public generate = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Lấy thông tin User an toàn từ Token (đã qua Middleware xác thực)
        const userId = req.user?.userId;
        // 2. Khởi tạo DTO với bộ ba: matrixId, name, và userId
        const dto = new GenerateExamDTO({
            matrixId: req.body.matrixId,
            name: req.body.name,
            userId: userId as string
        });

        // 3. Tự thực hiện Validation logic

        // 4. Ủy quyền (Delegate) cho Service thực hiện logic nghiệp vụ
        const response = await this._examGeneratorService.generate(dto);

        // 5. Trả về kết quả thông qua Utility Class Result
        Result.ok(
            res,
            response,
            Message.EXAM.GENERATE_SUCCESS,
            'EXAM_GENERATE_SUCCESS'
        );
    });

    /**
     * @description Khởi tạo bài thi thủ công bằng cách chỉ định danh sách câu hỏi cụ thể (Manual Snapshot).
     * @route POST /api/v1/exams/manual
     * @param {IAuthRequest} req - Chứa CreateManualExamDTO (name, questionIds) trong body. userId lấy từ Token.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa snapshot đề thi vừa được khởi tạo thủ công.
     */
    public createManual = catchAsync(async (req: IAuthRequest, res: Response) => {
        const userId = req.user?.userId;

        // 1. Khởi tạo DTO thủ công (Yêu cầu truyền mảng questionIds)
        const dto = new CreateManualExamRequestDTO({
            ...(req.body as ICreateManualExamInputDTO),
            userId: userId as string
        });

        // 2. Validate

        // 3. Gọi Service Generator (Thường xử lý bốc đề/kiểm tra tính hợp lệ của câu hỏi)
        const response = await this._examService.createManual(dto);

        Result.ok(
            res,
            response,
            Message.EXAM.CREATE_SUCCESS,
            'EXAM_MANUAL_CREATE_SUCCESS'
        );
    });

    /**
     * @description Cập nhật thông tin chi tiết của một bài thi (Tên, điểm số, hoặc trạng thái).
     * @route PATCH /api/v1/exams/:id
     * @param {IAuthRequest} req - Chứa id trên params và UpdateExamDTO trong body.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa ExamResponseDTO đã được cập nhật.
     */
    public edit = catchAsync(async (req: IAuthRequest, res: Response) => {
        const id = req.params.id as string;
        const userId = req.user?.userId;

        // 1. Khởi tạo DTO từ body và params
        const dto = new UpdateExamRequestDTO({
            ...(req.body as IUpdateExamInputDTO),
            userId: userId as string,
            id: id
        });

        // 3. Ủy quyền xử lý cho Service
        const response = await this._examService.updateExam(id, dto);

        // 4. Trả về kết quả
        Result.ok(
            res,
            response,
            Message.EXAM.UPDATE_SUCCESS,
            'EXAM_UPDATE_SUCCESS'
        );
    });

    /**
     * @description Thực hiện xóa mềm (Soft Delete) bài thi bằng cách cập nhật dấu mốc deletedAt.
     * @route DELETE /api/v1/exams/:id
     * @param {IAuthRequest} req - Chứa id của bài thi cần xóa trên URL params.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result xác nhận xóa thành công (data: null).
     */
    public delete = catchAsync(async (req: IAuthRequest, res: Response) => {
        const id = req.params.id as string;

        // Xử lý nghiệp vụ xóa qua Service
        const result = await this._examService.deleteExam(id);

        Result.ok(
            res,
            result,
            Message.EXAM.DELETE_SUCCESS,
            'EXAM_DELETE_SUCCESS'
        );
    });

    /**
     * @description Khôi phục bài thi đã bị xóa mềm bằng cách gỡ bỏ dấu mốc deletedAt.
     * @route PATCH /api/v1/exams/:id/restore
     * @param {IAuthRequest} req - Chứa id của bài thi cần khôi phục trên URL params.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa thông tin bài thi sau khi khôi phục.
     */
    public restore = catchAsync(async (req: IAuthRequest, res: Response) => {
        const id = req.params.id as string;

        // Xử lý nghiệp vụ khôi phục qua Service
        const response = await this._examService.restoreExam(id);

        Result.ok(
            res,
            response,
            Message.EXAM.RESTORE_SUCCESS,
            'EXAM_RESTORE_SUCCESS'
        );
    });

}