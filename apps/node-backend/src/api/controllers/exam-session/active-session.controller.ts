import { IActiveSessionService } from '@/domain/interfaces/services/exam-session';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { AuthRequest } from '@/shared/types/auth.types';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Response } from 'express';

/**
 * @interface IActiveSessionControllerCradle
 * @description "Túi đồ nghề" chứa các dịch vụ cần thiết để quản lý phiên hoạt động (Session).
 */
export interface IActiveSessionControllerCradle {
    activeSessionService: IActiveSessionService;
}

/**
 * @class ActiveSessionController
 * @description Tiếp nhận và điều phối các yêu cầu liên quan đến quản lý phiên làm việc của người dùng.
 */
export class ActiveSessionController {
    private readonly _activeSessionService: IActiveSessionService;

    /**
     * @description Khởi tạo ActiveSessionController với các phụ thuộc được tiêm vào.
     * @param {IActiveSessionControllerCradle} cradle - Dependencies từ DI Container.
     */
    constructor({ activeSessionService }: IActiveSessionControllerCradle) {
        this._activeSessionService = activeSessionService;
    }

    /**
     * @description Kiểm tra xem user có phiên làm bài cũ không (phục vụ Popup Resume).
     * @route GET /api/v1/active-sessions/current
     */
    public getCurrentSession = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const result = await this._activeSessionService.getCurrentSession(userId);

        Result.ok(
            res,
            result,
            result ? Message.SESSION.FOUND : Message.SESSION.NOT_FOUND,
            'SESSION_CHECK_SUCCESS'
        );
    });

    /**
     * @description Bắt đầu một phiên làm bài mới.
     * @route POST /api/v1/active-sessions/start
     */
    public startSession = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        const { examId } = req.body;
        const result = await this._activeSessionService.startSession(userId, { examId });

        Result.ok(
            res,
            result,
            Message.SESSION.START_SUCCESS,
            'SESSION_START_SUCCESS'
        );
    });

    /**
     * @description Đồng bộ đáp án từ FE lên NoSQL (Backup định kỳ).
     * @route PATCH /api/v1/active-sessions/sync
     */
    public syncAnswers = catchAsync(async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;
        // Body: { questionId: string, selectedAnswerIndex: number | null }
        await this._activeSessionService.updateAnswer(userId, req.body);

        Result.ok(
            res,
            null,
            Message.SESSION.SYNC_SUCCESS,
            'SESSION_SYNC_SUCCESS'
        );
    });
}