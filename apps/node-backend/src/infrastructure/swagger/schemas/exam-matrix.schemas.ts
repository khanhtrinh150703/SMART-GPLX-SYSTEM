export const examMatrixSchemas = {
    /**
     * ExamMatrixDetail: Breakdown of questions per chapter.
     * Nghĩa: Chi tiết số lượng câu hỏi theo từng chương.
     */
    ExamMatrixDetail: {
        type: 'object',
        properties: {
            chapterId: { type: 'string', format: 'uuid', example: "ce2ca1cf-5707-4e18-8e77-9d24b19e338f" },
            percentage: { type: 'integer', minimum: 0, maximum: 100, example: 20, description: 'Phần trăm câu hỏi của chương này' }
        }
    },

    /**
     * CreateExamMatrixDTO: Data transfer object for creating a new matrix.
     * Nghĩa: Đối tượng chuyển đổi dữ liệu để tạo mới một ma trận đề thi.
     */
    CreateExamMatrixDTO: {
        type: 'object',
        required: ['name', 'licenseCategoryId', 'totalQuestions', 'passingScore', 'durationMinutes', 'details'],
        properties: {
            name: { 
                type: 'string', 
                example: "Cấu trúc đề thi hạng A1 - 2026", 
                description: 'Tên hiển thị của ma trận đề thi' 
            },
            licenseCategoryId: { type: 'string', format: 'uuid', description: 'ID của hạng bằng lái' },
            totalQuestions: { type: 'integer', example: 35 },
            passingScore: { type: 'integer', example: 32 },
            durationMinutes: { type: 'integer', example: 19 },
            minCriticalQuestions: { type: 'integer', default: 1, description: 'Số câu điểm liệt tối thiểu' },
            isDefault: { 
                type: 'boolean', 
                default: true, 
                description: 'Thiết lập làm cấu trúc mặc định cho hạng bằng lái này' 
            },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            }
        }
    },

    /**
     * UpdateExamMatrixDTO: Data transfer object for updating an existing matrix.
     * Nghĩa: Đối tượng chuyển đổi dữ liệu để cập nhật ma trận đề thi hiện có.
     */
    UpdateExamMatrixDTO: {
        type: 'object',
        properties: {
            name: { type: 'string', example: "Cấu trúc đề thi hạng A1 - Cập nhật" },
            totalQuestions: { type: 'integer', example: 40 },
            passingScore: { type: 'integer', example: 36 },
            durationMinutes: { type: 'integer', example: 20 },
            minCriticalQuestions: { type: 'integer' },
            isDefault: { type: 'boolean', description: 'Cập nhật trạng thái mặc định' },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            }
        }
    },

    /**
     * ExamMatrixResponse: The data structure returned by the server.
     * Nghĩa: Cấu trúc dữ liệu được máy chủ trả về.
     */
    ExamMatrixResponse: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            licenseCategoryId: { type: 'string', format: 'uuid' },
            totalQuestions: { type: 'integer' },
            passingScore: { type: 'integer' },
            durationMinutes: { type: 'integer' },
            minCriticalQuestions: { type: 'integer' },
            isDefault: { type: 'boolean' },
            details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamMatrixDetail' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },

    /**
     * StandardResponse: Generic wrapper for all successful API calls.
     * Nghĩa: Lớp bao đóng chung cho tất cả các cuộc gọi API thành công.
     */
    StandardResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Thao tác thành công' },
            data: { type: 'object' }
        }
    },

    /**
     * BaseResponse: Basic structure for error or simple success messages.
     * Nghĩa: Cấu trúc cơ bản cho thông báo lỗi hoặc thông báo thành công đơn giản.
     */
    BaseResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mô tả thông báo' },
            timestamp: { type: 'string', format: 'date-time' },
        },
    }
};