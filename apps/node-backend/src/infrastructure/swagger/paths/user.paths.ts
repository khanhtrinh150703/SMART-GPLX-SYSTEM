import { API_CONSTANTS } from "@/domain/constants/api.constant";


export const userPaths = {
    [`${API_CONSTANTS.API_BASE}/users/me/profile`]: {
        patch: {
            tags: ['User Management'],
            summary: 'Cập nhật thông tin cá nhân',
            operationId: 'updateProfile',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateProfileDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Cập nhật profile thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/ValidationError' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/users/me/password`]: {
        patch: {
            tags: ['User Management'],
            summary: 'Đổi mật khẩu',
            operationId: 'changePassword',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ChangePasswordDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Đổi mật khẩu thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '400': { description: 'Mật khẩu cũ sai hoặc mật khẩu mới không khớp' },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/users/{id}/status`]: {
        patch: {
            tags: ['User Management'],
            summary: 'Cập nhật trạng thái tài khoản (Admin only)',
            operationId: 'changeUserStatus',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' },
                    description: 'User ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ChangeStatusDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Cập nhật trạng thái thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '403': { description: 'Không có quyền ADMIN' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/users/{id}`]: {
        delete: {
            tags: ['User Management'],
            summary: 'Xóa mềm tài khoản người dùng',
            description: 'Soft delete - Đánh dấu deletedAt',
            operationId: 'softDeleteUser',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' },
                    description: 'ID của người dùng cần xóa',
                },
            ],
            responses: {
                '200': {
                    description: 'Xóa mềm thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { description: 'Không tìm thấy người dùng' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/users/{id}/restore`]: {
        patch: {
            tags: ['User Management'],
            summary: 'Khôi phục tài khoản đã xóa mềm',
            description: 'Chỉ ADMIN mới có quyền thực hiện',
            operationId: 'restoreUser',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' },
                    description: 'ID của người dùng cần khôi phục',
                },
            ],
            responses: {
                '200': {
                    description: 'Khôi phục tài khoản thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { description: 'Không tìm thấy bản ghi đã xóa' },
                '409': {
                    description: 'Xung đột dữ liệu: Username hoặc Email đã bị chiếm dụng',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/users`]: {
        get: {
            tags: ['User Management'],
            summary: 'Lấy danh sách người dùng có phân trang (Admin)',
            description: 'Yêu cầu quyền ADMIN. Hỗ trợ tìm kiếm và phân trang.',
            operationId: 'getUsers',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                { name: 'search', in: 'query', schema: { type: 'string' } },
            ],
            responses: {
                '200': {
                    description: 'Lấy danh sách thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UserListResponse' },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '403': { description: 'Không có quyền ADMIN' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/license-categories/{id}`]: {
        put: {
            tags: ['License Category'],
            summary: 'Cập nhật hạng bằng lái',
            description: 'Chỉnh sửa tên hoặc mô tả của hạng bằng lái hiện có.',
            operationId: 'updateLicenseCategory',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID của hạng bằng lái',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateLicenseCategoryDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Cập nhật thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['License Category'],
            summary: 'Xóa hạng bằng lái',
            description: 'Thực hiện xóa mềm hạng bằng lái. Hệ thống sẽ chặn xóa nếu có câu hỏi hoặc đề thi liên quan.',
            operationId: 'deleteLicenseCategory',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID của hạng bằng lái',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            responses: {
                '200': {
                    description: 'Xóa thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' },
                        },
                    },
                },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/license-categories/{id}/restore`]: {
        patch: {
            tags: ['License Category'],
            summary: 'Khôi phục hạng bằng lái',
            description: 'Mở khóa (restore) hạng bằng lái đã bị xóa mềm trước đó.',
            operationId: 'restoreLicenseCategory',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'UUID của hạng bằng lái cần khôi phục',
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            responses: {
                '200': {
                    description: 'Khôi phục thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' },
                        },
                    },
                },
            },
        },
    },
}
