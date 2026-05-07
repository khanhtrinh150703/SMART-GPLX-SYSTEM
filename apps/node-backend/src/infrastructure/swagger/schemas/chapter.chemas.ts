/**
 * @description Hệ thống Schema (Models) cho Module Chapters
 * Đã đồng bộ format Result: { success, code, statusCode, message, data? }
 */
export const chapterSchemas = {
  // --- 1. CẤU TRÚC PHẢN HỒI CƠ SỞ (BASE RESULT) ---

  /**
   * @description Schema chuẩn cho phản hồi thành công
   */
  StandardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SUCCESS" },
      statusCode: { type: "integer", example: 200 },
      message: { type: "string", example: "Thao tác thành công" },
    },
  },

  /**
   * @description Schema chuẩn cho phản hồi lỗi
   */
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      code: { type: "string", example: "CHPT_101" },
      statusCode: { type: "integer", example: 400 },
      message: { type: "string", example: "Tên chương không được để trống" },
    },
  },

  // --- 2. DỮ LIỆU CHƯƠNG (DATA MODELS) ---

  ChapterResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      name: { type: "string", example: "Khái niệm và quy tắc giao thông" },
      code: { type: "string", example: "CHPT_01" },
      description: {
        type: "string",
        nullable: true,
        example: "Các quy tắc ưu tiên...",
      },
      orderIndex: { type: "integer", example: 1 },
      status: {
        type: "string",
        enum: ["active", "deleted"],
        example: "active",
      },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // --- 3. DTO CHO REQUEST ---

  CreateChapterDTO: {
    type: "object",
    required: ["name", "code", "description", "orderIndex"],
    properties: {
      name: { type: "string", example: "Văn hóa giao thông" },
      code: { type: "string", example: "CHPT_02" },
      description: { type: "string", maxLength: 500 },
      orderIndex: { type: "integer", minimum: 0 },
    },
  },

  UpdateChapterDTO: {
    type: "object",
    properties: {
      name: { type: "string" },
      code: { type: "string" },
      description: { type: "string", maxLength: 500 },
      orderIndex: { type: "integer", minimum: 0 },
    },
  },

  // --- 4. CẤU TRÚC WRAPPER PHẢN HỒI ---

  /**
   * @description Trả về 1 chương: { ..., data: { id, name, ... } }
   */
  ChapterSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ChapterResponse" },
        },
      },
    ],
  },

  /**
   * @description Trả về danh sách: { ..., data: { data: [...], meta: {...} } }
   */
  ChapterListResponse: {
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
                items: { $ref: "#/components/schemas/ChapterResponse" },
              },
              meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
          },
        },
      },
    ],
  },
};
