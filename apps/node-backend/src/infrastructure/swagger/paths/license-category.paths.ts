import { API_CONSTANTS } from "@/domain/constants/api.constant";

export const licensePaths = {
    // ====================== LICENSE CATEGORIES ======================
    [`${API_CONSTANTS.API_BASE}/license-categories`]: {
        get: {
            tags: ['License Category'],
            summary: 'Lấy danh sách hạng bằng lái',
            description: 'Trả về toàn bộ danh sách các hạng bằng lái đang hoạt động.',
            operationId: 'getLicenseCategories',
            responses: {
                '200': {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            // Chỉ riêng cái này là trả về List (mảng)
                            schema: { $ref: '#/components/schemas/LicenseCategoryListResponse' },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['License Category'],
            summary: 'Tạo mới hạng bằng lái',
            description: 'Tạo một hạng bằng lái mới. Trả về object data chi tiết.',
            operationId: 'createLicenseCategory',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateLicenseCategoryDTO' },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Đã tạo thành công',
                    content: {
                        'application/json': {
                            // Cập nhật: Có kèm data như ví dụ bạn đưa
                            schema: { $ref: '#/components/schemas/LicenseCategoryResponse' },
                        },
                    },
                },
                '409': { description: 'Tên đã tồn tại trong hệ thống' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/license-categories/{id}`]: {
        patch: {
            tags: ['License Category'],
            summary: 'Cập nhật hạng bằng lái',
            description: 'Chỉnh sửa thông tin. Trả về object data sau khi cập nhật.',
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
                            // Cập nhật: Có kèm data
                            schema: { $ref: '#/components/schemas/LicenseCategoryResponse' },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['License Category'],
            summary: 'Xóa hạng bằng lái',
            description: 'Thực hiện xóa mềm. Trả về object data của hạng bằng vừa bị xóa.',
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
            description: 'Mở khóa hạng bằng lái đã bị xóa mềm.',
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
                            // Cập nhật: Có kèm data
                            schema: { $ref: '#/components/schemas/LicenseCategoryResponse' },
                        },
                    },
                },
            },
        },
    },
}