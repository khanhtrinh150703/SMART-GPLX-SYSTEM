export const examMatrixSchemas = {
  /**
   * @description Chi tiết phân bổ câu hỏi theo từng chương.
   */
  ExamMatrixDetail: {
    type: "object",
    required: ["chapterId", "percentage"],
    properties: {
      chapterId: {
        type: "string",
        format: "uuid",
        example: "ce2ca1cf-5707-4e18-8e77-9d24b19e338f",
      },
      percentage: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        example: 20,
        description: "Phần trăm câu hỏi của chương này (Tổng phải = 100)",
      },
    },
  },

  /**
   * @description DTO để tạo mới ma trận đề thi.
   */
  CreateExamMatrixRequest: {
    type: "object",
    required: [
      "name",
      "licenseCategoryId",
      "totalQuestions",
      "passingScore",
      "durationMinutes",
      "details",
    ],
    properties: {
      name: {
        type: "string",
        example: "Cấu trúc đề thi hạng A1 - 2026",
        maxLength: 100,
      },
      licenseCategoryId: { type: "string", format: "uuid" },
      totalQuestions: { type: "integer", minimum: 1, example: 25 },
      passingScore: { type: "integer", minimum: 1, example: 21 },
      durationMinutes: { type: "integer", minimum: 1, example: 19 },
      minCriticalQuestions: { type: "integer", default: 1 },
      isDefault: { type: "boolean", default: false },
      details: {
        type: "array",
        minItems: 1,
        items: { $ref: "#/components/schemas/ExamMatrixDetail" },
      },
    },
  },

  /**
   * @description DTO để cập nhật ma trận (Các trường là optional).
   */
  UpdateExamMatrixRequest: {
    type: "object",
    properties: {
      name: { type: "string", maxLength: 100 },
      totalQuestions: { type: "integer", minimum: 1 },
      passingScore: { type: "integer", minimum: 1 },
      durationMinutes: { type: "integer", minimum: 1 },
      minCriticalQuestions: { type: "integer" },
      isDefault: { type: "boolean" },
      details: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamMatrixDetail" },
      },
    },
  },

  /**
   * @description Cấu trúc dữ liệu phản hồi đầy đủ.
   */
  ExamMatrixResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      licenseCategoryId: { type: "string", format: "uuid" },
      totalQuestions: { type: "integer" },
      passingScore: { type: "integer" },
      durationMinutes: { type: "integer" },
      minCriticalQuestions: { type: "integer" },
      status: { type: "string", enum: ["active", "draft", "deleted"] },
      isDefault: { type: "boolean" },
      details: {
        type: "array",
        items: { $ref: "#/components/schemas/ExamMatrixDetail" },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  // --- WRAPPERS (LỚP BAO ĐÓNG PHẢN HỒI) ---

  /**
   * @description Phản hồi cho một ma trận đơn lẻ.
   */
  ExamMatrixSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ExamMatrixResponseDTO" },
        },
      },
    ],
  },
};
