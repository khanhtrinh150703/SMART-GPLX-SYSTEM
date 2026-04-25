export const examPaths = {
  [`/exams/generate`]: {
    post: {
      tags: ['Exam Management'],
      summary: 'Khởi tạo bài thi mới (Bốc đề)',
      description: 'Tạo một bài thi ngẫu nhiên dựa trên ma trận cấu hình và kho câu hỏi hiện có.',
      operationId: 'generateExam',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/GenerateExamDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Khởi tạo đề thi thành công',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/ExamResponse' },
                  message: { type: 'string', example: 'Khởi tạo bài thi thành công' },
                },
              },
            },
          },
        },
        '400': {
          description: 'Lỗi Validation dữ liệu đầu vào',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                NameRequired: {
                  summary: 'Thiếu tên đề thi',
                  value: { success: false, code: 'EXAM_NAME_REQUIRED', message: 'Tên đề thi không được để trống.' }
                },
                InvalidMatrix: {
                  summary: 'Matrix ID sai định dạng',
                  value: { success: false, code: 'INVALID_MATRIX_ID', message: 'Mã ma trận đề thi không tồn tại hoặc không đúng định dạng.' }
                }
              }
            }
          }
        },
        '409': {
          description: 'Lỗi xung đột nghiệp vụ (Kho câu hỏi không đủ)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                InsufficientPool: {
                  summary: 'Tổng kho không đủ câu hỏi',
                  value: { success: false, code: 'INSUFFICIENT_POOL_QUESTIONS', message: 'Tổng kho câu hỏi không đủ số lượng để đáp ứng cấu trúc đề thi.' }
                },
                InsufficientCritical: {
                  summary: 'Thiếu câu điểm liệt',
                  value: { success: false, code: 'INSUFFICIENT_CRITICAL_QUESTIONS', message: 'Kho dữ liệu không đủ số lượng câu hỏi điểm liệt để tạo đề.' }
                }
              }
            }
          }
        },
        '500': {
          description: 'Lỗi xử lý hệ thống hoặc AI',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                AIError: {
                  summary: 'Lỗi AI Processing',
                  value: { success: false, code: 'AI_PROCESSING_ERROR', message: 'Hệ thống AI gặp sự cố trong quá trình xử lý dữ liệu.' }
                }
              }
            }
          }
        }
      },
    },
  },
};