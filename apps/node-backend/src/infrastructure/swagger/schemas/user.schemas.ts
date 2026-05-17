export const userSchemas = {
  UpdateProfileDTO: {
    type: "object",
    properties: {
      fullName: { type: "string", example: "Cậu Vàng V2" },
      urlPicture: {
        type: "string",
        format: "uri",
        example: "https://example.com/avatar.png",
      },
    },
  },

  ChangePasswordDTO: {
    type: "object",
    required: ["oldPassword", "newPassword", "confirmNewPassword"],
    properties: {
      oldPassword: { type: "string", format: "password" },
      newPassword: { type: "string", format: "password", minLength: 8 },
      confirmNewPassword: { type: "string", format: "password" },
    },
  },

  ChangeStatusDTO: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "BANNED", "PENDING"],
        example: "BANNED",
      },
    },
  },

  UserResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      username: { type: "string" },
      email: { type: "string" },
      fullName: { type: "string" },
      urlPicture: { type: "string" },
      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "BANNED", "PENDING"],
      },
      role: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  UserListResponse: {
    allOf: [
      { $ref: "#/components/schemas/SuccessResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/UserResponseDTO" },
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
    ],
  },
  UserSingleResponse: {
    allOf: [
      // 1. Lấy các trường chung: success, code, statusCode, message
      { $ref: "#/components/schemas/StandardResponse" },

      // 2. Định nghĩa trường data riêng cho User
      {
        type: "object",
        properties: {
          data: {
            $ref: "#/components/schemas/UserResponseDTO",
            description:
              "Thông tin chi tiết của người dùng sau khi thao tác thành công.",
          },
        },
      },
    ],
  },
  /**
   * @description DTO dùng để khóa/mở khóa tài khoản (Thay đổi trạng thái)
   */
  ChangeStatusInputDTO: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "BANNED"],
        example: "BANNED",
        description: "Trạng thái mới muốn áp dụng cho tài khoản",
      },
      reason: {
        type: "string",
        example: "Vi phạm quy chế thi nhiều lần",
        description: "Lý do thay đổi trạng thái (Tùy chọn)",
      },
    },
  },

  /**
   * @description DTO dành cho Admin cập nhật thông tin User khác
   */
  UpdateAdminInputDto: {
    type: "object",
    properties: {
      fullName: { type: "string", example: "Nguyễn Văn A" },
      email: {
        type: "string",
        format: "email",
        example: "nguyenvana@gmail.com",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN", "INSTRUCTOR"],
        example: "USER",
        description: "Phân quyền người dùng",
      },
      phoneNumber: { type: "string", example: "0901234567" },
    },
  },
};
