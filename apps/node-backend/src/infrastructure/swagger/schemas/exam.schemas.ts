export const examSchemas = {
  // 1. Schema cho DTO đầu vào
  GenerateExamDTO: {
    type: "object",
    required: ["matrixId", "name"],
    properties: {
      matrixId: {
        type: "string",
        format: "uuid",
        example: "33812c77-8a44-4205-af6c-8746c8a157b1",
        description: "ID của ma trận đề thi dùng để bốc đề",
      },
      name: {
        type: "string",
        maxLength: 100,
        example: "Bài thi sát hạch thử - Hạng A1",
        description: "Tên gợi nhớ cho bài thi",
      },
    },
  },

  // 2. Schema chi tiết cho từng câu hỏi trong đề (IExamQuestionResponse)
  ExamQuestionResponse: {
    type: "object",
    properties: {
      questionId: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      indexNumber: {
        type: "integer",
        example: 1,
        description: "Số thứ tự câu hỏi trong đề thi",
      },
      chapterId: {
        type: "string",
        format: "uuid",
        nullable: true,
        example: "acd135ef-6175-47d1-b65b-6e06d1a5ead1",
      },
      chapterName: {
        type: "string",
        nullable: true,
        example: "Chương I: Quy tắc giao thông đường bộ",
      },
      isCritical: {
        type: "boolean",
        example: false,
        description: "Đánh dấu câu hỏi điểm liệt",
      },
      correctAnswer: {
        type: "integer",
        nullable: true,
        example: 1,
        description: "Index của đáp án đúng (Dùng cho môi trường dev/test)",
      },
    },
  },

  // 3. Schema tổng thể cho bài thi (IExamResponse)
  ExamResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "77912c77-8a44-4205-af6c-8746c8a157b1",
      },
      name: {
        type: "string",
        example: "Bài thi sát hạch thử - Hạng A1",
      },
      userId: {
        type: "string",
        format: "uuid",
        example: "99212c77-8a44-4205-af6c-8746c8a157b1",
      },
      licenseCategoryId: {
        type: "string",
        format: "uuid",
        example: "33812c77-8a44-4205-af6c-8746c8a157b1",
      },
      totalQuestions: {
        type: "integer",
        example: 25,
      },
      durationMinutes: {
        type: "integer",
        example: 19,
      },
      startedAt: {
        type: "string",
        format: "date-time",
        example: "2026-04-23T10:00:00Z",
      },
      status: {
        type: "string",
        enum: ["STARTED", "COMPLETED", "CANCELLED"],
        example: "STARTED",
      },
      questions: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamQuestionResponse" },
      },
    },
  },
  /**
   * @description Phản hồi khi tạo đề hoặc lấy chi tiết 1 bài thi
   */
  ExamSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ExamResponse" },
        },
      },
    ],
  },

  /**
   * @description Phản hồi khi lấy danh sách lịch sử thi (Phân trang)
   */
  ExamListResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/ExamSummaryDTO" },
              },
              meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
          },
        },
      },
    ],
  },
  /**
   * @description Trạng thái bài thi (Fix lỗi ExamStatus)
   */
  ExamStatus: {
    type: "string",
    enum: [
      "STARTED",
      "COMPLETED",
      "CANCELLED",
      "PENDING",
      "IN_PROGRESS",
      "EXPIRED",
    ],
    example: "STARTED",
  },

  /**
   * @description DTO khởi tạo bài thi tự động (Fix lỗi GenerateExamRequest)
   */
  GenerateExamRequest: {
    type: "object",
    required: ["matrixId", "name"],
    properties: {
      matrixId: {
        type: "string",
        format: "uuid",
        example: "33812c77-8a44-4205-af6c-8746c8a157b1",
      },
      name: {
        type: "string",
        maxLength: 100,
        example: "Bài thi sát hạch thử - Hạng A1",
      },
    },
  },

  /**
   * @description DTO tạo bài thi thủ công (Fix lỗi CreateManualExamRequest)
   */
  CreateManualExamRequest: {
    type: "object",
    required: [
      "name",
      "userId",
      "licenseCategoryId",
      "durationMinutes",
      "passingScore",
    ],
    properties: {
      name: { type: "string", example: "Đề thi chọn lọc Admin" },
      userId: { type: "string", format: "uuid" },
      licenseCategoryId: { type: "string", format: "uuid" },
      questionIds: { type: "array", items: { type: "string", format: "uuid" } },
      durationMinutes: { type: "integer", minimum: 1 },
      passingScore: { type: "integer", minimum: 1 },
      minCriticalQuestions: { type: "integer", default: 1 },
    },
  },

  /**
   * @description DTO cập nhật bài thi (Fix lỗi UpdateExamRequest)
   */
  UpdateExamRequest: {
    type: "object",
    properties: {
      name: { type: "string" },
      durationMinutes: { type: "integer" },
      totalQuestions: { type: "integer" },
      passingScore: { type: "integer" },
      status: { $ref: "#/components/schemas/ExamStatus" },
    },
  },

  /**
   * @description DTO tóm tắt bài thi (Fix lỗi ExamSummaryDTO)
   */
  ExamSummaryDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      title: { type: "string" },
      category: { type: "string", example: "B2" },
      totalQuestions: { type: "integer" },
      passScore: { type: "integer" },
      limitMinutes: { type: "integer" },
    },
  },

  /**
   * @description Nội dung đầy đủ cho User làm bài (Fix lỗi ExamUserFullContentDTO)
   */
  // 1. DTO cho từng đáp án (Bám sát IExamUserAnswerResponseDTO)
  ExamUserAnswerDTO: {
    type: "object",
    properties: {
      position: {
        type: "integer",
        example: 1,
        description: "Thứ tự đáp án (1, 2, 3...)",
      },
      content: {
        type: "string",
        example: "Dừng xe nhường đường cho người đi bộ.",
      },
      imageUrl: {
        type: "string",
        example: "https://api.smart-gplx.vn/images/a1.png",
        nullable: true,
      },
    },
  },

  // 2. DTO cho từng câu hỏi (Bám sát IExamUserQuestionResponseDTO)
  ExamUserQuestionDTO: {
    type: "object",
    properties: {
      questionId: { type: "string", format: "uuid" },
      indexNumber: {
        type: "integer",
        example: 1,
        description: "Số thứ tự câu hỏi trong đề",
      },
      content: {
        type: "string",
        example: "Khi gặp biển này người lái xe phải xử lý thế nào?",
      },
      imageUrl: { type: "string", nullable: true },
      answers: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamUserAnswerDTO" },
      },
    },
  },

  // 3. DTO tổng thể bài thi (Bám sát IExamUserFullContentResponseDTO)
  ExamUserFullContentDTO: {
    type: "object",
    properties: {
      examId: { type: "string", format: "uuid" },
      title: { type: "string", example: "Đề thi sát hạch hạng B2 - Đề số 1" },
      limitMinutes: { type: "integer", example: 22 },
      totalQuestions: { type: "integer", example: 35 },
      licenseCategoryName: {
        type: "string",
        example: "Hạng B2",
        nullable: true,
      },
      questions: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamUserQuestionDTO" },
      },
    },
  },

  // 4. Response bọc ngoài cùng (Sử dụng StandardResponse)
  ExamUserFullContentResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ExamUserFullContentDTO" },
        },
      },
    ],
  },

  // 2. DTO câu hỏi rút gọn trong bài thi (Admin view)
  ExamQuestionAdminDTO: {
    type: "object",
    properties: {
      questionId: { type: "string", format: "uuid" },
      indexNumber: { type: "integer", example: 1 },
      chapterId: { type: "string", format: "uuid", nullable: true },
      chapterName: {
        type: "string",
        example: "Khái niệm và quy tắc",
        nullable: true,
      },
      isCritical: { type: "boolean", example: false },
      correctAnswer: { type: "integer", example: 1, nullable: true },
    },
  },

  // 3. DTO thông tin bài thi hoàn chỉnh (Bám sát ExamResponseDTO)
  ExamResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", example: "Đề thi sát hạch B2 - Đề 1" },
      userId: { type: "string", format: "uuid" },
      userName: { type: "string", example: "Nguyễn Văn A", nullable: true },
      licenseCategoryId: { type: "string", format: "uuid" },
      licenseCategoryName: { type: "string", example: "B2", nullable: true },
      totalQuestions: { type: "integer", example: 35 },
      durationMinutes: { type: "integer", example: 22 },
      passingScore: { type: "integer", example: 32 },
      minCriticalQuestions: { type: "integer", example: 1 },
      status: { $ref: "#/components/schemas/ExamStatus" },
      startedAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
      questions: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamQuestionAdminDTO" },
      },
    },
  },

  // 4. Response Phân trang bọc ngoài
  ExamPaginatedResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/ExamResponseDTO" },
              },
              meta: {
                type: "object",
                properties: {
                  total: { type: "integer", example: 100 },
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                  totalPages: { type: "integer", example: 10 },
                },
              },
            },
          },
        },
      },
    ],
  },
};
