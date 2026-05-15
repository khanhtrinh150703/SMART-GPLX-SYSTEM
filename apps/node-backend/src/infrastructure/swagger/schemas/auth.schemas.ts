/**
 * @description Hệ thống Schema cho Module Auth
 * Định nghĩa chuẩn xác theo các DTO Classes/Interfaces đã cung cấp.
 */
export const authSchemas = {
  // ============================================================================
  // 1. CẤU TRÚC PHẢN HỒI CƠ SỞ (BASE RESPONSES)
  // ============================================================================

  AuthStandardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SUCCESS" },
      statusCode: { type: "integer", example: 200 },
      message: { type: "string", example: "Thao tác thành công" },
    },
  },

  // ============================================================================
  // 2. DTO YÊU CẦU ĐẦU VÀO (INPUT DTOS)
  // ============================================================================

  /**
   * @description Ánh xạ từ IRegisterInputDTO
   */
  RegisterInputDTO: {
    type: "object",
    required: ["username", "email", "password", "confirmPassword"],
    properties: {
      username: { type: "string", minLength: 3, example: "trinh_dev" },
      email: { type: "string", format: "email", example: "trinh@example.com" },
      password: { type: "string", minLength: 8, example: "StrongPass@123" },
      confirmPassword: { type: "string", example: "StrongPass@123" },
    },
  },

  /**
   * @description Ánh xạ từ IVerifyUserInputDTO
   */
  VerifyUserInputDTO: {
    type: "object",
    required: ["email", "otp"],
    properties: {
      email: { type: "string", format: "email", example: "trinh@example.com" },
      otp: { type: "string", minLength: 6, maxLength: 6, example: "123456" },
    },
  },

  /**
   * @description Ánh xạ từ ILoginInputDTO
   */
  LoginInputDTO: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", example: "trinh_dev" },
      password: { type: "string", example: "Password@123" },
    },
  },
  ChangePasswordInputDTO: {
    type: "object",
    required: ["oldPassword", "newPassword"],
    properties: {
      oldPassword: {
        type: "string",
        format: "password",
        example: "OldPass123!",
        description: "Mật khẩu hiện tại của người dùng",
      },
      newPassword: {
        type: "string",
        format: "password",
        minLength: 8,
        example: "NewSecurePass2026!",
        description: "Mật khẩu mới (tối thiểu 8 ký tự)",
      },
    },
  },
  UpdateProfileInputDTO: {
    type: "object",
    properties: {
      fullName: { type: "string", example: "Nguyễn Văn Trinh" },
      phoneNumber: { type: "string", example: "0901234567" },
      avatarFile: {
        type: "string",
        format: "binary",
        description: "File ảnh đại diện mới (nếu muốn thay đổi)",
      },
    },
  },
  /**
   * @description Ánh xạ từ IRefreshTokenInputDTO
   */
  RefreshTokenInputDTO: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: {
        type: "string",
        minLength: 40,
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  },

  /**
   * @description Ánh xạ từ IResetPasswordInputDTO
   */
  ResetPasswordInputDTO: {
    type: "object",
    required: ["email", "otp", "newPassword"],
    properties: {
      email: { type: "string", format: "email", example: "trinh@example.com" },
      otp: { type: "string", minLength: 6, maxLength: 6, example: "123456" },
      newPassword: { type: "string", minLength: 6, example: "NewPass@123" },
    },
  },

  // ============================================================================
  // 3. DTO PHẢN HỒI (RESPONSE DTOS)
  // ============================================================================

  /**
   * @description Ánh xạ từ ILoginResponseDTO (Chứa User + Tokens)
   */
  LoginResponseDTO: {
    allOf: [
      { $ref: "#/components/schemas/AuthStandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  email: { type: "string", format: "email" },
                  username: { type: "string" },
                  fullName: { type: "string" },
                  urlPicture: { type: "string", format: "url" },
                  status: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                  roles: {
                    type: "array",
                    items: { $ref: "#/components/schemas/RoleResponseDTO" }, // Tham chiếu tới Role DTO
                  },
                },
              },
              accessToken: { type: "string" },
              refreshToken: { type: "string" },
            },
          },
        },
      },
    ],
  },

  /**
   * @description Ánh xạ từ ITokenResponseDTO (Chỉ chứa cặp Tokens)
   */
  TokenResponseDTO: {
    allOf: [
      { $ref: "#/components/schemas/AuthStandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              refreshToken: { type: "string" },
            },
          },
        },
      },
    ],
  },
};
