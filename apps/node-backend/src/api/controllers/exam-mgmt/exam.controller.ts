import { CreateManualExamDTO } from '@/application/dtos/request/exam/create-exam-manual.request.dto';
import { ExamQueryDTO } from '@/application/dtos/request/exam/exam-query.request.dto';
import { GenerateExamDTO } from '@/application/dtos/request/exam/generate-exam.request.dto';
import { UpdateExamDTO } from '@/application/dtos/request/exam/update-exam.request.dto';
import { IExamGeneratorService } from '@/domain/interfaces/services/exam-engine';
import { IExamService } from '@/domain/interfaces/services/exam-mgmt';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { AuthRequest } from '@/shared/types/auth.types';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Response } from 'express';

/**
 * @interface IExamControllerCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Exam Controller.
 * Đảm bảo tính an toàn về kiểu dữ liệu khi tiêm (inject) các dịch vụ liên quan đến Bài thi.
 */
export interface IExamControllerCradle {
    examService: IExamService;
    examGeneratorService: IExamGeneratorService,
}

/**
 * @class ExamController
 * @description Controller xử lý các yêu cầu HTTP liên quan đến Bài thi (Exams).
 * Đóng vai trò là "người điều phối" giữa Client và logic nghiệp vụ của hệ thống thi.
 */
export class ExamController {
    private readonly _examService: IExamService;
    private readonly _examGeneratorService: IExamGeneratorService;
    /**
     * @description Khởi tạo Controller với Service được "tiêm" trực tiếp từ DI Container qua Cradle.
     * @param {IExamControllerCradle} cradle - Chứa ExamService chuyên dụng.
     */
    constructor({ examService, examGeneratorService }: IExamControllerCradle) {
        this._examService = examService;
        this._examGeneratorService = examGeneratorService;
    }

    /**
     * @description Truy vấn danh sách toàn bộ đề thi trong hệ thống.
     * @route GET /api/v1/exams
     * @returns {Promise<void>} Phản hồi danh sách ExamResponseDTO kèm Metadata phân trang.
     */
    public list = catchAsync(async (req: AuthRequest, res: Response) => {
        // 1. Khởi tạo Query DTO từ req.query (Zero Any - ép kiểu unknown)
        const query = new ExamQueryDTO(req.query as Record<string, unknown>);
        // 2. Gọi Service xử lý nghiệp vụ
        const response = await this._examService.getPaginatedExams(query);
        console.log(response)

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
    public generate = catchAsync(async (req: AuthRequest, res: Response) => {
        // 1. Lấy thông tin User an toàn từ Token (đã qua Middleware xác thực)
        const userId = req.user?.userId;
        // 2. Khởi tạo DTO với bộ ba: matrixId, name, và userId
        const dto = new GenerateExamDTO({
            matrixId: req.body.matrixId,
            name: req.body.name,
            userId: userId as string
        });

        // 3. Tự thực hiện Validation logic
        dto.isValid();

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
     * @description Cập nhật thông tin chi tiết của một bài thi (Tên, điểm số, hoặc trạng thái).
     * @route PATCH /api/v1/exams/:id
     * @param {AuthRequest} req - Chứa id trên params và UpdateExamDTO trong body.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa ExamResponseDTO đã được cập nhật.
     */
    public edit = catchAsync(async (req: AuthRequest, res: Response) => {
        const  id  = req.params.id as string;

        // 1. Khởi tạo DTO từ body và params
        const dto = new UpdateExamDTO({
            ...req.body as Record<string, unknown>,
            id: id
        });

        // 2. Tự thực hiện Validation logic
        dto.isValid();

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
     * @param {AuthRequest} req - Chứa id của bài thi cần xóa trên URL params.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result xác nhận xóa thành công (data: null).
     */
    public delete = catchAsync(async (req: AuthRequest, res: Response) => {
        const  id  = req.params.id as string;

        // Xử lý nghiệp vụ xóa qua Service
        await this._examService.deleteExam(id);

        Result.ok(
            res,
            null,
            Message.EXAM.DELETE_SUCCESS,
            'EXAM_DELETE_SUCCESS'
        );
    });

    /**
     * @description Khôi phục bài thi đã bị xóa mềm bằng cách gỡ bỏ dấu mốc deletedAt.
     * @route PATCH /api/v1/exams/:id/restore
     * @param {AuthRequest} req - Chứa id của bài thi cần khôi phục trên URL params.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa thông tin bài thi sau khi khôi phục.
     */
    public restore = catchAsync(async (req: AuthRequest, res: Response) => {
        const  id  = req.params.id as string;

        // Xử lý nghiệp vụ khôi phục qua Service
        const response = await this._examService.restoreExam(id);

        Result.ok(
            res,
            response,
            Message.EXAM.RESTORE_SUCCESS,
            'EXAM_RESTORE_SUCCESS'
        );
    });

    /**
     * @description Khởi tạo bài thi thủ công bằng cách chỉ định danh sách câu hỏi cụ thể (Manual Snapshot).
     * @route POST /api/v1/exams/manual
     * @param {AuthRequest} req - Chứa CreateManualExamDTO (name, questionIds) trong body. userId lấy từ Token.
     * @param {Response} res - Đối tượng Response chuẩn của Express.
     * @returns {Promise<void>} Phản hồi Result chứa snapshot đề thi vừa được khởi tạo thủ công.
     */
    public createManual = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        // 1. Khởi tạo DTO thủ công (Yêu cầu truyền mảng questionIds)
        const dto = new CreateManualExamDTO({
            ...req.body as Record<string, unknown>,
            userId: userId as string
        });

        // 2. Validate
        dto.isValid();

        // 3. Gọi Service Generator (Thường xử lý bốc đề/kiểm tra tính hợp lệ của câu hỏi)
        const response = await this._examGeneratorService.createManual(dto);

        Result.ok(
            res,
            response,
            Message.EXAM.CREATE_SUCCESS,
            'EXAM_MANUAL_CREATE_SUCCESS'
        );
    }); 
}