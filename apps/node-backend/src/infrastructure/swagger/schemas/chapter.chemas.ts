export const chapterSchemas = {
    // --- CHAPTER REQUEST DTOS ---
    CreateChapterDTO: {
        type: 'object',
        required: ['name', 'orderIndex'],
        properties: {
            name: {
                type: 'string',
                example: 'Khái niệm và quy tắc giao thông',
                description: 'Tên chương lý thuyết'
            },
            description: {
                type: 'string',
                example: 'Bao gồm các định nghĩa và quy tắc ưu tiên',
                description: 'Mô tả nội dung chương'
            },
            orderIndex: {
                type: 'integer',
                example: 1,
                description: 'Thứ tự hiển thị trên ứng dụng'
            },
        },
    },

    UpdateChapterDTO: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'Tên chương cập nhật' },
            description: { type: 'string', example: 'Mô tả cập nhật' },
            orderIndex: { type: 'integer', example: 2 },
        },
    },

    // --- CHAPTER RESPONSE ---
    ChapterResponse: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            orderIndex: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },

    ChapterSingleResponse: {
        allOf: [
            { $ref: '#/components/schemas/StandardResponse' },
            {
                type: 'object',
                properties: {
                    data: { $ref: '#/components/schemas/ChapterResponse' }
                }
            }
        ]
    },

    ChapterListResponse: {
        allOf: [
            { $ref: '#/components/schemas/StandardResponse' },
            {
                type: 'object',
                properties: {
                    data: {
                        type: 'object',
                        properties: { 
                            data: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ChapterResponse' },
                            },
                            meta: {
                                type: 'object',
                                properties: {
                                    total: { type: 'integer', example: 100 },
                                    page: { type: 'integer', example: 1 },
                                    limit: { type: 'integer', example: 10 },
                                    totalPages: { type: 'integer', example: 10 },
                                },
                            },
                        } 
                    }
                },
            }
        ]
    }
}