import { CompleteExamInputDTO } from '@/application/dtos/request/exam/complete-exam.request.dto';
import { ICompleteExamService, IExamAttemptService } from '@/domain/interfaces/services/exam-session';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { AuthRequest } from '@/shared/types/auth.types';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Response } from 'express';


/**
 * @interface IExamAttemptControllerCradle
 * @description "Túi đồ nghề" chứa các service cần thiết để quản lý lượt làm bài và hoàn thành bài thi.
 */
export interface IExamAttemptControllerCradle {
    completeExamService: ICompleteExamService;
    attemptService: IExamAttemptService;
}

/**
 * @class ExamAttemptController
 * @description Tiếp nhận và điều phối các yêu cầu liên quan đến nỗ lực làm bài (Attempt) và hoàn tất bài thi.
 */
export class ExamAttemptController {
    private readonly _completeExamService: ICompleteExamService;
    private readonly _attemptService: IExamAttemptService;

    /**
     * @description Khởi tạo ExamAttemptController với các phụ thuộc chuyên biệt.
     * @param {IExamAttemptControllerCradle} cradle - Các phụ thuộc được tiêm từ DI Container.
     */
    constructor({ completeExamService, attemptService }: IExamAttemptControllerCradle) {
        this._completeExamService = completeExamService;
        this._attemptService = attemptService;
    }

    /**
     * @description Nộp bài thi, chấm điểm và lưu Snapshot NoSQL.
     * @route POST /api/v1/exam-attempts/complete
     */
    public completeExam = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;

        const { examId, answers } = req.body;
        const dto = new CompleteExamInputDTO(examId, answers)
        dto.isValid()
        const result = await this._completeExamService.completeExam(userId, dto);

        Result.ok(
            res,
            result,
            Message.EXAM.COMPLETE_SUCCESS,
            'EXAM_COMPLETE_SUCCESS'
        );
    });

    /**
     * @description Lấy danh sách lịch sử thi của người dùng.
     * @route GET /api/v1/exam-attempts/history
     */
    public getHistory = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const result = await this._attemptService.getUserAttemptHistory(userId);

        Result.ok(
            res,
            result,
            Message.EXAM.GET_HISTORY_SUCCESS,
            'GET_HISTORY_SUCCESS'
        );
    });

    /**
     * @description Xem chi tiết một bài làm cũ (Review câu đúng/sai từ Snapshot).
     * @route GET /api/v1/exam-attempts/:id/detail
     */
    public getDetail = catchAsync(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const result = await this._attemptService.getAttemptDetail(id);

        Result.ok(
            res,
            result,
            Message.EXAM.GET_DETAIL_SUCCESS,
            'GET_DETAIL_SUCCESS'
        );
    });
}