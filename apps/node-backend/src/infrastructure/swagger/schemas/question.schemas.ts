export const questionSchemas = {
    // Định nghĩa mức độ khó (Dễ/TB/Khó)
    DifficultySchema: {
        type: 'object',
        properties: {
            level: { type: 'integer', example: 2, description: '1: Dễ, 2: TB, 3: Khó' },
            label: { type: 'string', example: 'Trung bình' },
        },
    },

    // Định nghĩa Đáp án trả về
    AnswerResponseDTO: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: 'ans-uuid-123' },
            content: { type: 'string', example: 'Gồm ô tô, máy kéo, rơ moóc...' },
            imageUrl: { type: 'string', nullable: true, example: null },
            isCorrect: { type: 'boolean', example: true },
        },
    },

    // Định nghĩa Câu hỏi trả về
    QuestionResponseDTO: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            chapterId: { type: 'string', format: 'uuid' },
            content: { type: 'string', example: 'Khái niệm phương tiện giao thông cơ giới?' },
            imageUrl: { type: 'string', nullable: true },
            isCritical: { type: 'boolean', example: true },
            difficulty: { $ref: '#/components/schemas/DifficultySchema' },
            answers: {
                type: Array,
                items: { $ref: '#/components/schemas/AnswerResponseDTO' },
            },
            licenseCategoryIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
            },
        },
    },

    QuestionErrorResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: false },
            code: {
                type: 'string',
                description: 'Mã lỗi nghiệp vụ (e.g., QST_001, QST_404)',
                example: 'QST_001'
            },
            message: {
                type: 'string',
                example: 'ID chương lý thuyết không được để trống.'
            },
            details: { type: 'object', nullable: true }
        }
    },

    CreateUpdateQuestionDTO: {
        type: 'object',
        required: ['chapterId', 'content', 'difficultyLevel', 'licenseCategoryIds', 'answers'],
        properties: {
            chapterId: { type: 'string', format: 'uuid', example: 'chapter-uuid' },
            content: { type: 'string', minLength: 10, example: 'Khái niệm phương tiện giao thông cơ giới?' },
            imageUrl: { type: 'string', format: 'uri', nullable: true },
            isCritical: { type: 'boolean', default: false },
            difficultyLevel: { type: 'integer', enum: [1, 2, 3] },
            licenseCategoryIds: {
                type: 'array',
                minItems: 1,
                items: { type: 'string' },
                example: ['license-uuid-a1']
            },
            answers: {
                type: 'array',
                minItems: 2,
                items: {
                    type: 'object',
                    required: ['content', 'isCorrect'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        content: { type: 'string' },
                        isCorrect: { type: 'boolean' },
                        imageUrl: { type: 'string', nullable: true }
                    }
                }
            }
        }
    }
};