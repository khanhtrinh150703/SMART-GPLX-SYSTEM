// api/controllers/role.controller.ts
import { Request, Response } from 'express';
import { RoleService } from '@/application/services/role.service';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Result } from '@/shared/responses/api-response';
import { Message } from '@/shared/errors/messages/success-messages-vn';

export class RoleController {
    private readonly _roleService: RoleService;

    constructor({ roleService }: { roleService: RoleService }) {
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