// 1. SCHEMAS: Định nghĩa cấu trúc dữ liệu
export const importSchemas = {
    ImportStatus: {
        type: 'string',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'QUEUED'],
        description: 'Trạng thái tổng quát của phiên Import'
    },

    ImportStep: {
        type: 'string',
        enum: ['QUEUED', 'EXTRACTING', 'VALIDATING_EXCEL', 'UPLOADING_ASSETS', 'SAVING_DATABASE', 'COMPLETED', 'FAILED'],
        description: 'Tiến độ xử lý chi tiết trong Worker'
    },

    ImportError: {
        type: 'object',
        properties: {
            row: { type: 'integer', example: 5 },
            column: { type: 'string', example: 'C' },
            message: { type: 'string', example: 'Hạng bằng lái không hợp lệ' },
            timestamp: { type: 'string', format: 'date-time' }
        }
    },

    ImportResultData: {
        type: 'object',
        properties: {
            totalRows: { type: 'integer', example: 100 },
            processedRows: { type: 'integer', example: 45 },
            successCount: { type: 'integer', example: 40 },
            errorCount: { type: 'integer', example: 5 },
            currentStep: { $ref: '#/components/schemas/ImportStep' },
            errors: {
                type: 'array',
                items: { $ref: '#/components/schemas/ImportError' }
            },
            lastError: { type: 'string', nullable: true }
        }
    },

    InitImportDTO: {
        type: 'object',
        required: ['fileName', 'totalSize', 'totalChunks', 'chunkSizeLimit'],
        properties: {
            fileName: { type: 'string', example: 'cau_hoi_gplx.zip' },
            totalSize: { type: 'integer', example: 10485760 },
            totalChunks: { type: 'integer', example: 5 },
            chunkSizeLimit: { type: 'integer', example: 2097152 }
        }
    },

    ImportJob: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            fileName: { type: 'string' },
            totalSize: { type: 'integer' },
            totalChunks: { type: 'integer' },
            status: { $ref: '#/components/schemas/ImportStatus' },
            resultData: { $ref: '#/components/schemas/ImportResultData' },
            expiresAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },

    BaseResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Thao tác thành công' },
            timestamp: { type: 'string', format: 'date-time' },
        },
    },

    StandardResponse: {
        allOf: [
            { $ref: '#/components/schemas/BaseResponse' },
            {
                type: 'object',
                properties: {
                    code: { type: 'string', example: 'SUCCESS' },
                    statusCode: { type: 'integer', example: 200 },
                    data: { type: 'object' }
                }
            }
        ]
    },

    ErrorCode: {
        type: 'string',
        enum: ['BAD_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'INTERNAL_ERROR', 'VALIDATION_ERROR'],
        description: 'Mã lỗi nghiệp vụ hệ thống'
    },

    BadRequestError: {
        description: 'Lỗi yêu cầu không hợp lệ (400)',
        content: {
            'application/json': {
                schema: {
                    allOf: [
                        { $ref: '#/components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                code: { $ref: '#/components/schemas/ErrorCode' },
                            },
                        },
                    ],
                },
            },
        },
    },
    UnauthorizedError: {
        description: 'Lỗi chưa xác thực (401)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/BaseResponse' },
            },
        },
    },
    ForbiddenError: {
        description: 'Không có quyền truy cập (403)',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/BaseResponse' },
            },
        },
    },

};