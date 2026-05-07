import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { IRoleQueryService } from '@/domain/interfaces/services/identity/queries';

/**
 * @interface IRoleControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) tập hợp các dịch vụ cần thiết để quản lý và phân phối vai trò (Roles) trong hệ thống.
 */
export interface IRoleControllerCradle {
    /** @description Dịch vụ chuyên trách truy vấn danh sách và chi tiết các vai trò/quyền hạn. */
    roleQueryService: IRoleQueryService;
}

/**
 * @class RoleController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến quản lý Vai trò người dùng.
 * @principle Access Control Governance - Cung cấp nền tảng để phân quyền và kiểm soát truy cập dựa trên vai trò (RBAC).
 */
export class RoleController {
    /** @private @readonly @description Instance xử lý các yêu cầu đọc và thống kê danh sách vai trò. */
    private readonly _roleQueryService: IRoleQueryService;

    /**
     * @constructor
     * @description Khởi tạo RoleController bằng cách giải nén các phụ thuộc từ Cradle thông qua Awilix.
     * @param {IRoleControllerCradle} cradle - Chứa các dịch vụ Application cần thiết để quản trị phân quyền.
     */
    constructor({ roleQueryService }: IRoleControllerCradle) {
        this._roleQueryService = roleQueryService;
    }

    /**
     * @description API lấy danh sách vai trò để phục vụ việc chọn lựa (Dropdown)
     * @route GET /api/v1/roles/selection
     * @returns {Promise<void>}
     */
    public getSelectionList = catchAsync(async (_req: Request, res: Response) => {
        const data = await this._roleQueryService.getRoleSelections();
        Result.ok(
            res,
            data,
            Message.ROLE.FETCH_SELECTION_SUCCESS,
            'ROLE_SELECTION_SUCCESS'
        );
    });
}