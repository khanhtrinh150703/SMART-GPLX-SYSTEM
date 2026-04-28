import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Result } from '@/shared/responses/api-response';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { IRoleService } from '@/domain/interfaces/services/identity';

/**
 * @interface IRoleControllerCradle
 * @description "Túi đồ nghề" chứa các service cần thiết cho RoleController.
 */
export interface IRoleControllerCradle {
    roleService: IRoleService; // Giả định bạn có Interface cho Service này
}

/**
 * @class RoleController
 * @description Tiếp nhận và điều phối các yêu cầu HTTP liên quan đến quản lý Vai trò (Role).
 */
export class RoleController {
    private readonly _roleService: IRoleService;

    /**
     * @description Khởi tạo RoleController.
     * @param {IRoleControllerCradle} cradle - Các phụ thuộc được tiêm vào (Injected dependencies).
     */
    constructor({ roleService }: IRoleControllerCradle) {
        this._roleService = roleService;
    }

    /**
     * @description API lấy danh sách vai trò để phục vụ việc chọn lựa (Dropdown)
     * @route GET /api/v1/roles/selection
     * @returns {Promise<void>}
     */
    public getSelectionList = catchAsync(async (_req: Request, res: Response) => {
        const data = await this._roleService.getRoleSelections();
        Result.ok(
            res,
            data,
            Message.ROLE.FETCH_SELECTION_SUCCESS,
            'ROLE_SELECTION_SUCCESS'
        );
    });
}