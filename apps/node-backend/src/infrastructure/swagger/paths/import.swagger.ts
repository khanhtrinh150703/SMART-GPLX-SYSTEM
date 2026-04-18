import { API_CONSTANTS } from "@/domain/constants/api.constant";

export const importPaths = {
    // API 1: Khởi tạo phiên (Init Session)
    [`${API_CONSTANTS.API_BASE}/import/init`]: {
        post: {
            tags: ['Import Management'],
            summary: 'Khởi tạo phiên làm việc để upload file ZIP',
            operationId: 'initImport',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/InitImportDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Khởi tạo thành công',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/ImportJob' }
                                        }
                                    }
                                ]
                            },
                        },
                    },
                },
            },
        },
    },

    // API 2: Upload từng mảnh (Upload Chunk)
    [`${API_CONSTANTS.API_BASE}/import/upload-chunk`]: {
        post: {
            tags: ['Import Management'],
            summary: 'Tải lên từng mảnh (chunk) của file ZIP',
            operationId: 'uploadChunk',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['jobId', 'index', 'chunk'],
                            properties: {
                                jobId: { type: 'string', format: 'uuid', description: 'ID của phiên import' },
                                index: { type: 'integer', description: 'Số thứ tự của mảnh (bắt đầu từ 0)' },
                                chunk: { type: 'string', format: 'binary', description: 'Dữ liệu mảnh file' },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Tải mảnh thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' },
                        },
                    },
                },
            },
        },
    },

    // API 3: Hoàn tất (Complete)
    [`${API_CONSTANTS.API_BASE}/import/complete`]: {
        post: {
            tags: ['Import Management'],
            summary: 'Hoàn tất quá trình tải lên và đưa vào hàng đợi xử lý',
            operationId: 'completeImport',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['jobId'],
                            properties: {
                                jobId: { type: 'string', format: 'uuid' },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Đã đưa vào hàng đợi xử lý',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    jobId: { type: 'string', format: 'uuid' },
                                                    status: { $ref: '#/components/schemas/ImportStatus' }
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                        },
                    },
                },
            },
        },
    },

    // API 4: Lấy trạng thái (Get Status)
    [`${API_CONSTANTS.API_BASE}/import/status/{jobId}`]: {
        get: {
            tags: ['Import Management'],
            summary: 'Lấy tiến độ và trạng thái hiện tại của Job',
            operationId: 'getImportStatus',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'jobId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' },
                    description: 'ID của Job cần lấy trạng thái'
                },
            ],
            responses: {
                '200': {
                    description: 'Thông tin tiến độ hiện tại',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/ImportJob' }
                                        }
                                    }
                                ]
                            },
                        },
                    },
                },
                '404': {
                    description: 'Không tìm thấy Job ID tương ứng'
                }
            },
        },
    },
};