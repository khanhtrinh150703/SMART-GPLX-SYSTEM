export const examMatrixSchemas = {
    // Schema cho chi tiết từng chương
    ExamMatrixDetail: {
        type: 'object',
        properties: {
            chapterId: { type: 'string', example: "ce2ca1cf-5707-4e18-8e77-9d24b19e338f" },
            percentage: { type: 'integer', example: 20 }
        }
    },

    // Schema cho DTO tạo mới
    CreateExamMatrixDTO: {
        type: 'object',
        required: ['licenseCategoryId', 'totalQuestions', 'passingScore', 'durationMinutes', 'details'],
        properties: {
            licenseCategoryId: { type: 'string', format: 'uuid' },
            totalQuestions: { type: 'integer', example: 35 },
            passingScore: { type: 'integer', example: 32 },
            durationMinutes: { type: 'integer', example: 19 },
            minCriticalQuestions: { type: 'integer', default: 1 },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            }
        }
    },

    // Schema cho DTO cập nhật
    UpdateExamMatrixDTO: {
        type: 'object',
        required: ['totalQuestions', 'passingScore', 'durationMinutes', 'details'],
        properties: {
            totalQuestions: { type: 'integer', example: 40 },
            passingScore: { type: 'integer', example: 36 },
            durationMinutes: { type: 'integer', example: 20 },
            minCriticalQuestions: { type: 'integer', default: 1 },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            }
        }
    },

    // Schema Response trả về
    ExamMatrixResponse: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            licenseCategoryId: { type: 'string', format: 'uuid' },
            totalQuestions: { type: 'integer' },
            passingScore: { type: 'integer' },
            durationMinutes: { type: 'integer' },
            minCriticalQuestions: { type: 'integer' },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            }
        }
    },

    // Schema Response chuẩn của hệ thống
    StandardResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Thao tác thành công' },
            data: { type: 'object' }
        }
    }
};