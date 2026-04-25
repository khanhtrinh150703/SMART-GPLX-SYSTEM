export const examSchemas = {
    // 1. Schema cho DTO đầu vào
    GenerateExamDTO: {
        type: 'object',
        required: ['matrixId', 'name'],
        properties: {
            matrixId: {
                type: 'string',
                format: 'uuid',
                example: '33812c77-8a44-4205-af6c-8746c8a157b1',
                description: 'ID của ma trận đề thi dùng để bốc đề'
            },
            name: {
                type: 'string',
                maxLength: 100,
                example: 'Bài thi sát hạch thử - Hạng A1',
                description: 'Tên gợi nhớ cho bài thi'
            }
        }
    },

    // 2. Schema chi tiết cho từng câu hỏi trong đề (IExamQuestionResponse)
    ExamQuestionResponse: {
        type: 'object',
        properties: {
            questionId: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000'
            },
            indexNumber: {
                type: 'integer',
                example: 1,
                description: 'Số thứ tự câu hỏi trong đề thi'
            },
            chapterId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                example: 'acd135ef-6175-47d1-b65b-6e06d1a5ead1'
            },
            chapterName: {
                type: 'string',
                nullable: true,
                example: 'Chương I: Quy tắc giao thông đường bộ'
            },
            isCritical: {
                type: 'boolean',
                example: false,
                description: 'Đánh dấu câu hỏi điểm liệt'
            },
            correctAnswer: {
                type: 'integer',
                nullable: true,
                example: 1,
                description: 'Index của đáp án đúng (Dùng cho môi trường dev/test)'
            }
        }
    },

    // 3. Schema tổng thể cho bài thi (IExamResponse)
    ExamResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                example: '77912c77-8a44-4205-af6c-8746c8a157b1'
            },
            name: {
                type: 'string',
                example: 'Bài thi sát hạch thử - Hạng A1'
            },
            userId: {
                type: 'string',
                format: 'uuid',
                example: '99212c77-8a44-4205-af6c-8746c8a157b1'
            },
            licenseCategoryId: {
                type: 'string',
                format: 'uuid',
                example: '33812c77-8a44-4205-af6c-8746c8a157b1'
            },
            totalQuestions: {
                type: 'integer',
                example: 25
            },
            durationMinutes: {
                type: 'integer',
                example: 19
            },
            startedAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-23T10:00:00Z'
            },
            status: {
                type: 'string',
                enum: ['STARTED', 'COMPLETED', 'CANCELLED'],
                example: 'STARTED'
            },
            questions: {
                type: 'array',
                items: { $ref: '#/components/schemas/ExamQuestionResponse' }
            }
        }
    }
};