import { GenerateExamDTO } from '@/application/dtos/request/exam/generate-exam.request.dto';
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

    // /**
    //  * @description API nộp bài thi và chấm điểm tự động.
    //  * @route POST /api/v1/exams/:id/complete
    //  */
    // public complete = catchAsync(async (req: Request, res: Response) => {
    //     const { id: examId } = req.params;
    //     const userId = req.user?.id as string;

    //     // Logic nộp bài...
    //     const response = await this._examService.completeExam(userId, examId, req.body);

    //     Result.ok(
    //         res,
    //         response,
    //         Message.EXAM.SUBMIT_SUCCESS,
    //         'EXAM_SUBMIT_SUCCESS'
    //     );
    // });
}