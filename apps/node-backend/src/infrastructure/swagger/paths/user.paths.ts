export const userPaths = {
    [`/users/me/profile`]: {
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

    [`/users/me/password`]: {
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

    [`/users/{id}/status`]: {
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

    [`/users/{id}`]: {
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

    [`/users/{id}/restore`]: {
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

    [`/users`]: {
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
}
