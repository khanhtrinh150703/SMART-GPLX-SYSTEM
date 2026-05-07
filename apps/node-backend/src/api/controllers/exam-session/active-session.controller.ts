import { StartSessionRequestDTO, UpdateAnswerRequestDTO } from '@/application/dtos/request/active-session/active-session.request.dto';
import { IActiveSessionService } from '@/domain/interfaces/services/exam-session';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { IAuthRequest } from '@/shared/types/authRequest.types';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Response } from 'express';

/**
 * @interface IActiveSessionControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) chứa các dịch vụ cần thiết để quản lý và kiểm soát phiên hoạt động.
 */
export interface IActiveSessionControllerCradle {
    /** @description Dịch vụ thực hiện các thao tác kiểm tra, thu hồi và quản lý vòng đời của phiên làm việc. */
    activeSessionService: IActiveSessionService;
}

/**
 * @class ActiveSessionController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến quản lý phiên làm việc của người dùng.
 * @principle Security Enforcement - Đảm bảo tính toàn vẹn của phiên đăng nhập và cung cấp khả năng kiểm soát truy cập từ xa (ví dụ: đăng xuất khỏi thiết bị khác).
 */
export class ActiveSessionController {
    /** @private @readonly @description Instance xử lý logic nghiệp vụ về phiên hoạt động. */
    private readonly _activeSessionService: IActiveSessionService;

    /**
     * @constructor
     * @description Khởi tạo ActiveSessionController thông qua cơ chế tiêm phụ thuộc (DI) của Awilix.
     * @param {IActiveSessionControllerCradle} cradle - Chứa các dịch vụ chuyên biệt để xử lý luồng Session.
     */
    constructor({ activeSessionService }: IActiveSessionControllerCradle) {
        this._activeSessionService = activeSessionService;
    }

    /**
     * @description Kiểm tra xem user có phiên làm bài cũ không (phục vụ Popup Resume).
     * @route GET /api/v1/active-sessions/current
     */
    public getCurrentSession = catchAsync(async (req: IAuthRequest, res: Response) => {
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
     * @description Bắt đầu một phiên làm bài mới (Hỗ trợ cả Học viên và Khách).
     * @route POST /api/v1/active-sessions/start
     */
    public startSession = catchAsync(async (req: IAuthRequest, res: Response) => {
        /**
         * 1. Xác định danh tính: Ưu tiên lấy từ Token (authMiddleware), 
         */
        const userId = req.user?.userId || `GUEST_${Date.now()}`;
        const isGuest = !req.user;

        /**
         * 2. Khởi tạo và Validate dữ liệu đầu vào.
         */
        const dto = new StartSessionRequestDTO(req.body);

        /**
         * 3. Chuyển tiếp xử lý xuống tầng Service.
         */
        const result = await this._activeSessionService.startSession(userId, dto, isGuest);
        // 4. Phản hồi kết quả thành công cho Client
        Result.ok(
            res,
            result,
            Message.SESSION.START_SUCCESS,
            'SESSION_START_SUCCESS'
        );
    });

    /**
     * @description Đồng bộ đáp án từ FE lên NoSQL (Sao lưu định kỳ).
     * @route PATCH /api/v1/active-sessions/sync
     * @access Private (User)
     */
    public syncAnswers = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Lấy userId từ thông tin định danh (đã qua authMiddleware)
        const userId = req.user.userId;
        /**
         * 2. Khởi tạo DTO từ req.body. 
         */
        const dto = new UpdateAnswerRequestDTO(req.body);

        // 3. Gọi Service để cập nhật đáp án với dữ liệu đã được bảo đảm (Type-safe)
        const result = await this._activeSessionService.updateAnswer(userId, dto);
        // 4. Phản hồi thành công
        Result.ok(
            res,
            result,
            Message.SESSION.SYNC_SUCCESS,
            'SESSION_SYNC_SUCCESS'
        );
    });

    /**
     * @description Xóa phiên làm bài đang hoạt động (Hủy bài hoặc dọn dẹp sau khi nộp).
     * @route DELETE /api/v1/active-sessions/current
     * @access Private (User)
     */
    public deleteSession = catchAsync(async (req: IAuthRequest, res: Response) => {
        // 1. Lấy userId từ thông tin định danh 
        const userId = req.user.userId;

        /**
         * 2. Gọi Service để xóa phiên làm bài.
         */
        const result = await this._activeSessionService.deleteByUserId(userId);

        // 3. Phản hồi thành công
        Result.ok(
            res,
            result, // Xóa xong thường trả về null hoặc object rỗng
            Message.SESSION.DELETE_SUCCESS, // Đảm bảo bạn đã định nghĩa hằng số này
            'SESSION_DELETE_SUCCESS'
        );
    });
}