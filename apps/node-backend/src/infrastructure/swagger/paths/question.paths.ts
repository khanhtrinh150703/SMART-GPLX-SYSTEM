export const questionPaths = {
    /**
     * ROUTE: /questions
     * Thao tác trên danh sách câu hỏi
     */
    [`/questions`]: {
        get: {
            tags: ['Question Management'],
            summary: 'Lấy danh sách câu hỏi',
            description: 'Lấy toàn bộ câu hỏi đang hoạt động. Có thể lọc theo chapterId hoặc licenseId.',
            parameters: [
                { name: 'chapterId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                { name: 'licenseId', in: 'query', schema: { type: 'string', format: 'uuid' } },
            ],
            responses: {
                '200': {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: { type: 'array', items: { $ref: '#/components/schemas/QuestionResponseDTO' } },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['Question Management'],
            summary: 'Tạo câu hỏi mới',
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUpdateQuestionDTO' } } },
            },
            responses: {
                '201': { description: 'Tạo thành công' },
                '400': {
                    description: 'Lỗi Validation nghiệp vụ: \n' +
                        '- QST_001: Thiếu chương \n' +
                        '- QST_002: Nội dung quá ngắn \n' +
                        '- QST_003: Thiếu hạng bằng \n' +
                        '- QST_004: Thiếu số đáp án \n' +
                        '- QST_005: Thiếu đáp án đúng \n' +
                        '- QST_006: URL ảnh lỗi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
                '404': {
                    description: 'ID Chương hoặc ID Hạng bằng không tồn tại trong hệ thống',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
                '409': {
                    description: 'QST_409: Nội dung câu hỏi này đã tồn tại',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
            },
        },
    },

    /**
     * ROUTE: /questions/{id}
     * Thao tác trên một câu hỏi cụ thể
     */
    [`/questions/{id}`]: {
        get: {
            tags: ['Question Management'],
            summary: 'Lấy chi tiết câu hỏi',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: {
                '200': {
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionResponseDTO' } } },
                },
                '404': {
                    description: 'QST_404: Không tìm thấy câu hỏi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
            },
        },
        put: {
            tags: ['Question Management'],
            summary: 'Cập nhật câu hỏi (Smart Update)',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUpdateQuestionDTO' } } },
            },
            responses: {
                '200': { description: 'Cập nhật thành công' },
                '400': {
                    description: 'Lỗi Validation nghiệp vụ: \n' +
                        '- QST_001: Thiếu chương \n' +
                        '- QST_002: Nội dung quá ngắn \n' +
                        '- QST_003: Thiếu hạng bằng \n' +
                        '- QST_004: Thiếu số đáp án \n' +
                        '- QST_005: Thiếu đáp án đúng \n' +
                        '- QST_006: URL ảnh lỗi, \n' +
                        '- QUESTION_ANSWERS_SYNC_ERROR: Lỗi truyền thiếu/sai ID đáp án cũ',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
                '404': {
                    description: 'Không tìm thấy ID câu hỏi (QST_404), ID chương hoặc ID hạng bằng',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
                '409': {
                    description: 'QST_409: Nội dung mới bị trùng với một câu hỏi khác',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
            },
        },
        delete: {
            tags: ['Question Management'],
            summary: 'Xóa mềm câu hỏi',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: {
                '200': { description: 'Xóa thành công' },
                '400': {
                    description: 'QUESTION_CANNOT_DELETE_CRITICAL: Không được xóa câu hỏi điểm liệt',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/QuestionErrorResponse' } } },
                },
                '404': { description: 'QST_404: Không tìm thấy câu hỏi để xóa' },
            },
        },
    },

    /**
     * ROUTE: /questions/{id}/restore
     * Khôi phục dữ liệu
     */
    [`/questions/{id}/restore`]: {
        patch: {
            tags: ['Question Management'],
            summary: 'Khôi phục câu hỏi đã xóa',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: {
                '200': {
                    description: 'Khôi phục thành công',
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/QuestionResponseDTO' } },
                    },
                },
                '404': { description: 'QST_404: Không tìm thấy bản ghi để khôi phục' },
            },
        },
    },
};