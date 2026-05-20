import { deleteResponse, securityResponses } from "../helper/swaggerHelpers";

/**
 * @description Định nghĩa các luồng API cho Module Chapters
 * Đã tích hợp đầy đủ 100% mã lỗi từ DTO validate() và Business Logic.
 */
export const chapterPaths = {
  // --- ENDPOINT: DANH SÁCH ---
  [`/chapters`]: {
    get: {
      tags: ["Chapters (Private)"],
      summary: "Lấy danh sách chương học",
      security: [{ bearerAuth: [] }],
      parameters: [
        // Từ BaseQueryDTO
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string", default: "createdAt" },
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
        },
        {
          name: "status",
          in: "query",
          schema: { type: "string", enum: ["active", "deleted", "all"] },
          description: "active | deleted | all",
        },
        { name: "search", in: "query", schema: { type: "string" } },

        { name: "name", in: "query", schema: { type: "string" } },
        { name: "orderIndex", in: "query", schema: { type: "integer" } },
        { name: "description", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChapterListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },

    // --- ENDPOINT: TẠO MỚI ---
    post: {
      tags: ["Chapters (Private)"],
      summary: "Tạo mới chương lý thuyết",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateChapterDTO" },
          },
        },
      },
      responses: {
        201: { description: "Tạo thành công" },
        400: {
          description: "Lỗi xác thực dữ liệu đầu vào (Validation Errors)",
          content: {
            "application/json": {
              examples: {
                invalidInput: {
                  value: {
                    success: false,
                    code: "SYS_400",
                    statusCode: 400,
                    message: "Dữ liệu đầu vào không hợp lệ",
                  },
                },
                nameRequired: {
                  value: {
                    success: false,
                    code: "CHPT_101",
                    statusCode: 400,
                    message: "Tên chương không được trống",
                  },
                },
                codeRequired: {
                  value: {
                    success: false,
                    code: "CHPT_102",
                    statusCode: 400,
                    message: "Mã chương không được trống",
                  },
                },
                descRequired: {
                  value: {
                    success: false,
                    code: "CHPT_103",
                    statusCode: 400,
                    message: "Mô tả không được trống",
                  },
                },
                descTooLong: {
                  value: {
                    success: false,
                    code: "CHPT_104",
                    statusCode: 400,
                    message: "Mô tả quá dài",
                  },
                },
                invalidOrder: {
                  value: {
                    success: false,
                    code: "CHPT_003",
                    statusCode: 400,
                    message: "Thứ tự hiển thị không hợp lệ",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
        409: {
          description: "Xung đột dữ liệu",
          content: {
            "application/json": {
              examples: {
                nameExists: {
                  value: {
                    success: false,
                    code: "CHPT_409",
                    statusCode: 409,
                    message: "Trùng TÊN chương",
                  },
                },
                codeExists: {
                  value: {
                    success: false,
                    code: "CHPT_410",
                    statusCode: 409,
                    message: "Trùng MÃ chương",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // --- ENDPOINT: CHI TIẾT / CẬP NHẬT / XÓA ---
  [`/chapters/{id}`]: {
    patch: {
      tags: ["Chapters (Private)"],
      summary: "Cập nhật chương lý thuyết",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateChapterDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        400: {
          description: "Lỗi xác thực dữ liệu cập nhật",
          content: {
            "application/json": {
              examples: {
                idRequired: {
                  invalidInput: {
                    value: {
                      success: false,
                      code: "SYS_400",
                      statusCode: 400,
                      message: "Dữ liệu đầu vào không hợp lệ",
                    },
                  },
                  value: {
                    success: false,
                    code: "CHPT_100",
                    statusCode: 400,
                    message: "Thiếu ID chương để cập nhật",
                  },
                },
                nameRequired: {
                  value: {
                    success: false,
                    code: "CHPT_101",
                    statusCode: 400,
                    message: "Tên chương không được trống",
                  },
                },
                codeRequired: {
                  value: {
                    success: false,
                    code: "CHPT_102",
                    statusCode: 400,
                    message: "Mã chương không được trống",
                  },
                },
                descRequired: {
                  value: {
                    success: false,
                    code: "CHPT_103",
                    statusCode: 400,
                    message: "Mô tả không được trống",
                  },
                },
                descTooLong: {
                  value: {
                    success: false,
                    code: "CHPT_104",
                    statusCode: 400,
                    message: "Mô tả quá dài",
                  },
                },
                invalidOrder: {
                  value: {
                    success: false,
                    code: "CHPT_003",
                    statusCode: 400,
                    message: "Thứ tự hiển thị không hợp lệ",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "CHPT_404",
                statusCode: 404,
                message: "Không tìm thấy chương",
              },
            },
          },
        },
        409: {
          description: "Trùng lặp dữ liệu",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "CHPT_410",
                statusCode: 409,
                message: "Mã chương đã tồn tại",
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Chapters (Private)"],
      summary: "Xóa mềm chương lý thuyết",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID chương lý thuyết (UUID)",
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        // 1. Lấy Base Response (200 SUCCESS)
        ...deleteResponse,

        // 2. Override lỗi ràng buộc nghiệp vụ riêng của Chapter
        400: {
          description: "Vi phạm ràng buộc dữ liệu",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "CHPT_403", // Mã lỗi riêng: Có dữ liệu phụ thuộc (câu hỏi)
                statusCode: 400,
                message: "Vi phạm ràng buộc (chương này đang chứa câu hỏi)",
              },
            },
          },
        },

        // 3. Chèn các phản hồi bảo mật (401, 403)
        ...securityResponses,

        // 4. Chốt chặn lỗi không tìm thấy
        404: {
          description: "Không tìm thấy chương lý thuyết",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "CHPT_404",
                statusCode: 404,
                message: "Không tìm thấy chương để xóa",
              },
            },
          },
        },
      },
    },
  },

  // --- ENDPOINT: KHÔI PHỤC ---
  [`/chapters/{id}/restore`]: {
    patch: {
      tags: ["Chapters (Private)"],
      summary: "Khôi phục chương học đã xóa",
      responses: {
        200: { description: "Khôi phục thành công" },
        ...securityResponses,
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "CHPT_404",
                statusCode: 404,
                message: "Không tìm thấy chương để khôi phục",
              },
            },
          },
        },
      },
    },
  },
};
