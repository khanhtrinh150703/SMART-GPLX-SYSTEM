export const importPaths = {
    /**
     * API 1: Khởi tạo phiên (Init Session)
     * Summary: Initialize a new import session to upload a ZIP file.
     * Nghĩa: Khởi tạo một phiên nhập (import) mới để tải lên tệp ZIP.
     */
    '/import/init': {
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
                '400': { $ref: '#/components/schemas/BadRequestError' },
                '401': { $ref: '#/components/schemas/UnauthorizedError' },
                '403': { $ref: '#/components/schemas/ForbiddenError' },
            },
        },
    },

    /**
     * API 2: Upload từng mảnh (Upload Chunk)
     * Summary: Upload an individual chunk of the ZIP file.
     * Nghĩa: Tải lên một mảnh (chunk) riêng lẻ của tệp ZIP.
     */
    '/import/upload-chunk': {
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
                                jobId: {
                                    type: 'string',
                                    format: 'uuid',
                                    description: 'ID của phiên import nhận được từ API Init'
                                },
                                index: {
                                    type: 'integer',
                                    minimum: 0,
                                    description: 'Số thứ tự của mảnh (bắt đầu từ 0)'
                                },
                                chunk: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'Dữ liệu nhị phân của mảnh file'
                                },
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
                '400': { $ref: '#/components/schemas/BadRequestError' },
                '401': { $ref: '#/components/schemas/UnauthorizedError' },
                '403': { $ref: '#/components/schemas/ForbiddenError' },
                '413': { description: 'Mảnh file quá lớn (Payload Too Large)' },
            },
        },
    },

    /**
     * API 3: Hoàn tất (Complete)
     * Summary: Finalize the upload and move the job to the processing queue.
     * Nghĩa: Hoàn tất quá trình tải lên và chuyển công việc vào hàng đợi xử lý.
     */
    '/import/complete': {
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
                    description: 'Đã đưa vào hàng đợi xử lý thành công',
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
                '400': { $ref: '#/components/schemas/BadRequestError' },
                '401': { $ref: '#/components/schemas/UnauthorizedError' },
                '403': { $ref: '#/components/schemas/ForbiddenError' },
                '404': {
                    description: 'Không tìm thấy Job ID',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BaseResponse' }
                        }
                    }
                },
            },
        },
    },

    /**
     * API 4: Lấy trạng thái (Get Status)
     * Summary: Retrieve the current progress and status of an import job.
     * Nghĩa: Lấy tiến độ và trạng thái hiện tại của một công việc nhập (import).
     */
    '/import/status/{jobId}': {
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
                    description: 'ID của Job cần theo dõi'
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
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '403': { $ref: '#/components/responses/ForbiddenError' },
                '404': {
                    description: 'Không tìm thấy Job ID tương ứng',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BaseResponse' }
                        }
                    }
                },
            },
        },
    },
};