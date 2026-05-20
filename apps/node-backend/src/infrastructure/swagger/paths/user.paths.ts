import { deleteResponse, securityResponses } from "../helper/swaggerHelpers";

export const userPaths = {
  // ================= USER SCOPE =================
  [`/users/me/profile`]: {
    patch: {
      tags: ["User (Public)"],
      summary: "Cập nhật thông tin cá nhân",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: { $ref: "#/components/schemas/UpdateProfileInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserSingleResponse" },
            },
          },
        },
        400: {
          description: "Lỗi xác thực",
          content: {
            "application/json": {
              examples: {
                missing: {
                  value: {
                    success: false,
                    code: "USER_110",
                    statusCode: 400,
                    message: "Không có dữ liệu để update",
                  },
                },
                nameLong: {
                  value: {
                    success: false,
                    code: "USER_103",
                    statusCode: 400,
                    message: "Họ tên quá dài",
                  },
                },
              },
            },
          },
        },
        401: securityResponses[401],
      },
    },
  },

  [`/users/me/password`]: {
    patch: {
      tags: ["User (Public)"],
      summary: "Thay đổi mật khẩu cá nhân",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ChangePasswordInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Đổi mật khẩu thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserSingleResponse" },
            },
          },
        },
        400: {
          description: "Lỗi logic mật khẩu",
          content: {
            "application/json": {
              examples: {
                oldReq: {
                  value: {
                    success: false,
                    code: "USER_120",
                    statusCode: 400,
                    message: "Thiếu mật khẩu cũ",
                  },
                },
                diff: {
                  value: {
                    success: false,
                    code: "USER_122",
                    statusCode: 400,
                    message: "Mật khẩu mới phải khác mật khẩu cũ",
                  },
                },
                weak: {
                  value: {
                    success: false,
                    code: "USER_123",
                    statusCode: 400,
                    message: "Mật khẩu mới không đủ độ mạnh",
                  },
                },
              },
            },
          },
        },
        401: securityResponses[401],
      },
    },
  },

  // ================= ADMIN SCOPE =================
  [`/users`]: {
    get: {
      tags: ["User (Private)"],
      summary: "Lấy danh sách người dùng (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "fullName", in: "query", schema: { type: "string" } },
        { name: "email", in: "query", schema: { type: "string" } },
        {
          name: "roles",
          in: "query",
          schema: { type: "string" },
          description: "Lọc theo Role Name",
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/users/admin/{id}`]: {
    patch: {
      tags: ["User (Private)"],
      summary: "Admin cập nhật Profile người dùng",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: { $ref: "#/components/schemas/UpdateProfileInputDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "USER_404",
                statusCode: 404,
                message: "Người dùng không tồn tại",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/users/{id}/admin`]: {
    put: {
      tags: ["User (Private)"],
      summary: "Admin cập nhật chi tiết & vai trò",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateAdminInputDto" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        400: {
          description: "Lỗi xác thực",
          content: {
            "application/json": {
              examples: {
                roleFormat: {
                  value: {
                    success: false,
                    code: "USER_111",
                    statusCode: 400,
                    message: "Roles phải là mảng",
                  },
                },
                roleReq: {
                  value: {
                    success: false,
                    code: "USER_106",
                    statusCode: 400,
                    message: "Thiếu vai trò",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/users/{id}/status`]: {
    patch: {
      tags: ["User (Private)"],
      summary: "Cập nhật trạng thái tài khoản",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ChangeStatusInputDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        400: {
          description: "Lỗi trạng thái",
          content: {
            "application/json": {
              examples: {
                missing: {
                  value: {
                    success: false,
                    code: "USER_112",
                    statusCode: 400,
                    message: "Thiếu trạng thái cần cập nhật",
                  },
                },
                invalid: {
                  value: {
                    success: false,
                    code: "USER_105",
                    statusCode: 400,
                    message: "Trạng thái không hợp lệ",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/users/{id}`]: {
    delete: {
      tags: ["User (Private)"],
      summary: "Xóa (Xóa mềm) tài khoản",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        ...deleteResponse, // Đã bao gồm 200 với đầy đủ ví dụ SOFT/HARD
        ...securityResponses, // 401, 403
        404: {
          description: "Người dùng không tồn tại",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                code: "USER_404",
                statusCode: 404,
                message: "Không tìm thấy thông tin người dùng trong hệ thống.",
              },
            },
          },
        },
      },
    },
  },

  // --- 2. KHÔI PHỤC TÀI KHOẢN ---
  [`/users/{id}/restore`]: {
    patch: {
      tags: ["User (Private)"],
      summary: "Khôi phục tài khoản đã bị xóa",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Khôi phục thành công",
          content: {
            "application/json": {
              // Thường khôi phục xong sẽ trả về object User đã được active lại
              schema: { $ref: "#/components/schemas/UserSingleResponse" },
            },
          },
        },
        ...securityResponses,
        404: {
          description: "Không tìm thấy người dùng để khôi phục",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                code: "USER_404",
                statusCode: 404,
                message: "Người dùng không tồn tại hoặc chưa từng bị xóa mềm.",
              },
            },
          },
        },
      },
    },
  },
};
