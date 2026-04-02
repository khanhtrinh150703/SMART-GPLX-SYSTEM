import { API_CONSTANTS } from "@/domain/constants/api.constant";


export const licensePaths = {
    // ====================== LICENSE CATEGORIES ======================
    [`${API_CONSTANTS.API_BASE}/license-categories`]: {
        get: {
            tags: ['License Category'],
            summary: 'Lấy danh sách hạng bằng lái',
            description: 'Trả về toàn bộ danh sách các hạng bằng lái đang hoạt động (chưa bị xóa mềm).',
            operationId: 'getLicenseCategories',
            responses: {
                '200': {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LicenseCategoryListResponse' },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['License Category'],
            summary: 'Tạo mới hạng bằng lái',
            description: 'Tạo một hạng bằng lái mới vào hệ thống. Yêu cầu quyền Quản trị viên.',
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
                            schema: { $ref: '#/components/schemas/StandardResponse' },
                        },
                    },
                },
                '409': { description: 'Tên đã tồn tại trong hệ thống' },
            },
        },
    },
}