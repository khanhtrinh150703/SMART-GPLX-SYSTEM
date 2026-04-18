export const importSchemas = {
    // 1. Trạng thái phiên (Import Status)
    ImportStatus: {
        type: 'string',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'QUEUED'],
        description: 'Trạng thái tổng quát của phiên Import'
    },

    // 2. Các bước xử lý (Import Step)
    ImportStep: {
        type: 'string',
        enum: ['QUEUED', 'EXTRACTING', 'VALIDATING_EXCEL', 'UPLOADING_ASSETS', 'SAVING_DATABASE', 'COMPLETED', 'FAILED'],
        description: 'Tiến độ xử lý chi tiết trong Worker'
    },

    // 3. Cấu trúc Lỗi dòng (Import Error)
    ImportError: {
        type: 'object',
        properties: {
            row: { type: 'integer', example: 5 },
            column: { type: 'string', example: 'C' },
            message: { type: 'string', example: 'Hạng bằng lái không hợp lệ' },
            timestamp: { type: 'string', format: 'date-time' }
        }
    },

    // 4. Dữ liệu kết quả xử lý (Import Result Data)
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

    // 5. DTO khởi tạo phiên (Init Import DTO)
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

    // 6. Cấu trúc Job Entity đầy đủ
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

    // 7. Standard Response Wrapper (Dựa trên StandardResponse interface của bạn)
    StandardResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Thao tác thành công' },
            data: { type: 'object' } // Sẽ được overwrite ở từng API cụ thể
        }
    }
};