export const chapterPaths = {
    [`/chapters`]: {
        get: {
            tags: ['Chapters'],
            summary: 'Lấy danh sách toàn bộ chương lý thuyết',
            responses: {
                200: {
                    description: 'Thành công',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterListResponse' } } }
                }
            }
        },
        post: {
            tags: ['Chapters'],
            summary: 'Tạo mới một chương lý thuyết',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateChapterDTO' } } }
            },
            responses: {
                201: {
                    description: 'Tạo thành công',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterSingleResponse' } } }
                },
                409: { description: 'Tên chương đã tồn tại' }
            }
        }
    },
    [`/chapters/{id}`]: {
        patch: {
            tags: ['Chapters'],
            summary: 'Cập nhật thông tin chương lý thuyết',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateChapterDTO' } } }
            },
            responses: {
                200: {
                    description: 'Cập nhật thành công',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterSingleResponse' } } }
                }
            }
        },
        delete: {
            tags: ['Chapters'],
            summary: 'Xóa mềm chương lý thuyết',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
                200: { description: 'Xóa thành công' },
                400: { description: 'Không thể xóa chương đang chứa câu hỏi' }
            }
        }
    },
    [`/chapters/{id}/restore`]: {
        patch: {
            tags: ['Chapters'],
            summary: 'Khôi phục chương lý thuyết đã xóa mềm',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: {
                200: {
                    description: 'Khôi phục thành công',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterSingleResponse' } } }
                }
            }
        }
    }
}