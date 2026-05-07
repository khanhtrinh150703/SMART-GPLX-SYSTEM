export const questionSchemas = {
  /**
   * @description Schema cho từng đáp án đơn lẻ
   */
  AnswerResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid", description: "ID của đáp án" },
      content: {
        type: "string",
        example: "Giảm tốc độ, chú ý quan sát và nhường đường.",
      },
      isCorrect: {
        type: "boolean",
        example: true,
        description: "Đây có phải đáp án đúng không",
      },
      imageUrl: {
        type: "string",
        format: "url",
        nullable: true,
        example: null,
      },
    },
  },

  /**
   * @description Schema câu hỏi cơ bản (Dành cho người dùng/thí sinh)
   */
  QuestionResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      indexNumber: { type: "integer", example: 1 },
      chapterId: { type: "string", format: "uuid" },
      content: { type: "string", example: "Câu hỏi về quy tắc giao thông..." },
      imageUrl: { type: "string", format: "url", nullable: true },
      isCritical: {
        type: "boolean",
        example: false,
        description: "Câu điểm liệt",
      },
      difficulty: {
        type: "object",
        properties: {
          level: { type: "integer", example: 1 },
          label: { type: "string", example: "Dễ" },
        },
      },
      status: { type: "string", enum: ["active", "hidden", "draft"] },
      answers: {
        type: "array",
        items: { $ref: "#/components/schemas/AnswerResponseDTO" },
      },
      licenseCategoryIds: {
        type: "array",
        items: { type: "string" },
        example: ["B1", "B2"],
      },
    },
  },

  /**
   * @description Schema câu hỏi dành cho Admin (Có thêm thông tin quản trị)
   */
  QuestionAdminResponseDTO: {
    allOf: [
      { $ref: "#/components/schemas/QuestionResponseDTO" },
      {
        type: "object",
        properties: {
          chapterName: { type: "string", example: "Khái niệm và quy tắc" },
          licenseCategoryNames: {
            type: "array",
            items: { type: "string" },
            example: ["Hạng B1", "Hạng B2"],
          },
          createdAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
    ],
  },

  /**
   * @description Schema tóm tắt phục vụ làm đề thi (Exam Pool)
   */
  ExamQuestionSummaryResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      content: { type: "string" },
      chapterName: { type: "string" },
      chapterOrder: { type: "integer" },
      isCritical: { type: "boolean" },
      indexNumber: { type: "integer" },
      licenseIds: { type: "array", items: { type: "string" } },
      licenseCategoryNames: { type: "array", items: { type: "string" } },
    },
  },

  /**
   * @description Request Schema khi tạo mới câu hỏi (Multipart Form)
   */
  CreateQuestionRequest: {
    type: "object",
    required: [
      "chapterId",
      "content",
      "answers",
      "licenseCategoryIds",
      "isCritical",
    ],
    properties: {
      chapterId: { type: "string", format: "uuid" },
      content: { type: "string", minLength: 10 },
      answers: {
        type: "string",
        description:
          'Mảng JSON String chứa các đáp án. VD: \'[{"content": "...", "isCorrect": true}]\'',
      },
      licenseCategoryIds: { type: "array", items: { type: "string" } },
      isCritical: { type: "boolean" },
      difficultyLevel: { type: "integer", default: 1 },
      questionImage: {
        type: "string",
        format: "binary",
        description: "File ảnh minh họa",
      },
    },
  },

  /**
   * @description Request Schema khi cập nhật câu hỏi
   */
  UpdateQuestionRequest: {
    allOf: [
      { $ref: "#/components/schemas/CreateQuestionRequest" },
      {
        type: "object",
        properties: {
          indexNumber: { type: "integer" },
          status: { type: "string", enum: ["active", "hidden", "draft"] },
        },
      },
    ],
  },

  // --- WRAPPERS (CẤU TRÚC PHẢN HỒI CHUẨN) ---

  QuestionSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/QuestionAdminResponseDTO" },
        },
      },
    ],
  },

  QuestionListResponse: {
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
                items: {
                  $ref: "#/components/schemas/QuestionAdminResponseDTO",
                },
              },
              meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
          },
        },
      },
    ],
  },
};
