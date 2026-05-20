import { deleteResponse, securityResponses } from "../helper/swaggerHelpers";

export const licensePaths = {
  // ====================== LICENSE CATEGORIES ======================
  "/license-categories": {
    get: {
      tags: ["License Categories (Private)"],
      summary: "Lấy danh sách hạng bằng lái",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string", default: "orderIndex" },
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
        },
        {
          name: "minAge",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        { name: "description", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/StandardResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/LicenseCategory" },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        ...securityResponses,
      },
    },
    post: {
      tags: ["License Categories (Private)"],
      summary: "Tạo mới hạng bằng lái",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateLicenseCategoryDTO" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StandardResponse" },
            },
          },
        },
        400: {
          description: "Lỗi dữ liệu (Validation)",
          content: {
            "application/json": {
              invalidInput: {
                value: {
                  success: false,
                  code: "SYS_400",
                  statusCode: 400,
                  message: "Dữ liệu đầu vào không hợp lệ",
                },
              },
              idRequired: {
                summary: "Thiếu ID",
                value: {
                  success: false,
                  code: "LIC_100",
                  statusCode: 400,
                  message: "ID hạng bằng là bắt buộc",
                },
              },
              nameRequired: {
                summary: "Tên trống",
                value: {
                  success: false,
                  code: "LIC_101",
                  statusCode: 400,
                  message: "Tên hạng bằng không được trống",
                },
              },
              nameLength: {
                summary: "Tên quá dài",
                value: {
                  success: false,
                  code: "LIC_102",
                  statusCode: 400,
                  message: "Độ dài tên hạng bằng không hợp lệ (1-10 ký tự)",
                },
              },
              nameFormat: {
                summary: "Sai định dạng Regex",
                value: {
                  success: false,
                  code: "LIC_103",
                  statusCode: 400,
                  message: "Tên hạng bằng sai định dạng (Regex)",
                },
              },
              ageRequired: {
                summary: "Thiếu độ tuổi",
                value: {
                  success: false,
                  code: "LIC_104",
                  statusCode: 400,
                  message: "Độ tuổi là bắt buộc và phải là số",
                },
              },
              ageInvalid: {
                summary: "Chưa đủ 18 tuổi",
                value: {
                  success: false,
                  code: "LIC_105",
                  statusCode: 400,
                  message: "Độ tuổi không đạt yêu cầu tối thiểu (18 tuổi)",
                },
              },
              descRequired: {
                summary: "Mô tả trống",
                value: {
                  success: false,
                  code: "LIC_106",
                  statusCode: 400,
                  message: "Mô tả không được trống",
                },
              },
              descTooLong: {
                summary: "Mô tả quá dài",
                value: {
                  success: false,
                  code: "LIC_107",
                  statusCode: 400,
                  message: "Mô tả quá dài (max 500)",
                },
              },
              orderInvalid: {
                summary: "Thứ tự âm",
                value: {
                  success: false,
                  code: "LIC_108",
                  statusCode: 400,
                  message: "Thứ tự hiển thị không hợp lệ",
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
              example: {
                success: false,
                code: "LIC_409",
                statusCode: 409,
                message: "Tên hạng bằng lái này đã tồn tại",
              },
            },
          },
        },
      },
    },
  },
  "/license-categories/{id}": {
    patch: {
      tags: ["License Categories (Private)"],
      summary: "Cập nhật hạng bằng lái",
      description:
        "Cập nhật thông tin chi tiết hạng bằng. Yêu cầu vé 'licenses:manage'.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID của hạng bằng lái (UUID)",
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateLicenseCategoryDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StandardResponse" },
            },
          },
        },
        400: {
          description: "Dữ liệu đầu vào không hợp lệ (Validation Error)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StandardResponse" },
              examples: {
                invalidInput: {
                  value: {
                    success: false,
                    code: "SYS_400",
                    statusCode: 400,
                    message: "Dữ liệu đầu vào không hợp lệ",
                  },
                },
                idRequired: {
                  summary: "Thiếu ID",
                  value: {
                    success: false,
                    code: "LIC_100",
                    statusCode: 400,
                    message: "ID hạng bằng là bắt buộc",
                  },
                },
                nameRequired: {
                  summary: "Tên trống",
                  value: {
                    success: false,
                    code: "LIC_101",
                    statusCode: 400,
                    message: "Tên hạng bằng không được trống",
                  },
                },
                nameLength: {
                  summary: "Tên quá dài",
                  value: {
                    success: false,
                    code: "LIC_102",
                    statusCode: 400,
                    message: "Độ dài tên hạng bằng không hợp lệ (1-10 ký tự)",
                  },
                },
                nameFormat: {
                  summary: "Sai định dạng Regex",
                  value: {
                    success: false,
                    code: "LIC_103",
                    statusCode: 400,
                    message: "Tên hạng bằng sai định dạng (Regex)",
                  },
                },
                ageRequired: {
                  summary: "Thiếu độ tuổi",
                  value: {
                    success: false,
                    code: "LIC_104",
                    statusCode: 400,
                    message: "Độ tuổi là bắt buộc và phải là số",
                  },
                },
                ageInvalid: {
                  summary: "Chưa đủ 18 tuổi",
                  value: {
                    success: false,
                    code: "LIC_105",
                    statusCode: 400,
                    message: "Độ tuổi không đạt yêu cầu tối thiểu (18 tuổi)",
                  },
                },
                descRequired: {
                  summary: "Mô tả trống",
                  value: {
                    success: false,
                    code: "LIC_106",
                    statusCode: 400,
                    message: "Mô tả không được trống",
                  },
                },
                descTooLong: {
                  summary: "Mô tả quá dài",
                  value: {
                    success: false,
                    code: "LIC_107",
                    statusCode: 400,
                    message: "Mô tả quá dài (max 500)",
                  },
                },
                orderInvalid: {
                  summary: "Thứ tự âm",
                  value: {
                    success: false,
                    code: "LIC_108",
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
          description: "Không tìm thấy hạng bằng",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "LIC_002",
                statusCode: 404,
                message: "Không tìm thấy hạng bằng lái yêu cầu",
              },
            },
          },
        },
        409: {
          description: "Trùng tên hạng bằng",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "LIC_409",
                statusCode: 409,
                message: "Tên hạng bằng lái này đã tồn tại",
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["License Categories (Private)"],
      summary: "Xóa mềm hạng bằng lái",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID hạng bằng lái (UUID)",
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        // 1. Lấy Base Response (Mặc định mã 200 SUCCESS kèm StandardResponse)
        ...deleteResponse,

        // 2. Lỗi xung đột dữ liệu (Hạng bằng đang được liên kết với bộ câu hỏi/ma trận)
        409: {
          description: "Dữ liệu đang được sử dụng",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "LIC_003",
                statusCode: 409,
                message: "Hạng bằng lái này đang được sử dụng, không thể xóa",
              },
            },
          },
        },

        // 3. Chèn các phản hồi bảo mật (401, 403)
        ...securityResponses,

        // 4. Chốt chặn lỗi không tìm thấy tài nguyên
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "LIC_404",
                statusCode: 404,
                message: "Không tìm thấy hạng bằng lái để xóa",
              },
            },
          },
        },
      },
    },
  },
  "/license-categories/{id}/restore": {
    patch: {
      tags: ["License Categories (Private)"],
      summary: "Khôi phục hạng bằng lái",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        ...deleteResponse,
        ...securityResponses,
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "LIC_404",
                statusCode: 404,
                message: "Không tìm thấy hạng bằng lái để khôi phục",
              },
            },
          },
        },
      },
    },
  },
};
