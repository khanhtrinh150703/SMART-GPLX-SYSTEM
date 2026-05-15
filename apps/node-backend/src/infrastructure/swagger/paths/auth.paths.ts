export const authPaths = {
  // ============================================================================
  // 1. FLOW ĐĂNG KÝ
  // ============================================================================
  [`/auth/register/init`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Khởi tạo đăng ký và gửi OTP",
      requestBody: {
        required: true,
        // Dùng đúng RegisterInputDTO ông đã đưa
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Khởi tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthStandardResponse" },
            },
          },
        },
        400: {
          description: "Lỗi xác thực đầu vào",
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
                usernameInv: {
                  value: {
                    success: false,
                    code: "AUTH_112",
                    statusCode: 400,
                    message: "Tên đăng nhập không hợp lệ",
                  },
                },
                emailInv: {
                  value: {
                    success: false,
                    code: "AUTH_102",
                    statusCode: 400,
                    message: "Email không đúng định dạng",
                  },
                },
                passWeak: {
                  value: {
                    success: false,
                    code: "AUTH_108",
                    statusCode: 400,
                    message: "Mật khẩu quá yếu",
                  },
                },
                mismatch: {
                  value: {
                    success: false,
                    code: "AUTH_110",
                    statusCode: 400,
                    message: "Mật khẩu xác nhận không khớp",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  [`/auth/register/verify`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Xác thực OTP hoàn tất đăng ký",
      requestBody: {
        required: true,
        // Dùng đúng VerifyUserInputDTO ông đã đưa
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/VerifyUserInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Tài khoản kích hoạt thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthStandardResponse" },
            },
          },
        },
        400: {
          description: "Lỗi OTP",
          content: {
            "application/json": {
              examples: {
                emailReq: {
                  value: {
                    success: false,
                    code: "AUTH_101",
                    statusCode: 400,
                    message: "Email là bắt buộc",
                  },
                },
                otpReq: {
                  value: {
                    success: false,
                    code: "AUTH_103",
                    statusCode: 400,
                    message: "Mã OTP là bắt buộc",
                  },
                },
                otpInv: {
                  value: {
                    success: false,
                    code: "AUTH_104",
                    statusCode: 400,
                    message: "Mã OTP sai",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  [`/auth/resend-otp`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Gửi lại mã OTP",
      requestBody: {
        required: true,
        // Đã bổ sung requestBody (Thường dùng email để gửi lại)
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { email: { type: "string" } },
              required: ["email"],
            },
          },
        },
      },
      200: {
        description: "OTP mới đã được gửi",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthStandardResponse" },
          },
        },
      },
    },
  },

  // ============================================================================
  // 2. FLOW ĐĂNG NHẬP & SESSION
  // ============================================================================
  [`/auth/login`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Đăng nhập hệ thống",
      requestBody: {
        required: true,
        // Dùng đúng LoginInputDTO
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Thành công",
          // Dùng đúng LoginResponseDTO
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponseDTO" },
            },
          },
        },
        400: {
          description: "Lỗi nhập liệu",
          content: {
            "application/json": {
              examples: {
                userReq: {
                  value: {
                    success: false,
                    code: "AUTH_111",
                    statusCode: 400,
                    message: "Tên đăng nhập là bắt buộc",
                  },
                },
                passReq: {
                  value: {
                    success: false,
                    code: "AUTH_106",
                    statusCode: 400,
                    message: "Mật khẩu là bắt buộc",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Lỗi bảo mật",
          content: {
            "application/json": {
              examples: {
                creds: {
                  value: {
                    success: false,
                    code: "AUTH_407",
                    statusCode: 401,
                    message: "Sai tài khoản hoặc mật khẩu",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  [`/auth/refresh-token`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Làm mới Access Token",
      requestBody: {
        required: true,
        // Dùng đúng RefreshTokenInputDTO
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RefreshTokenInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Cấp mới thành công",
          // Dùng đúng TokenResponseDTO
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TokenResponseDTO" },
            },
          },
        },
        400: {
          description: "Lỗi Token",
          content: {
            "application/json": {
              examples: {
                req: {
                  value: {
                    success: false,
                    code: "AUTH_113",
                    statusCode: 400,
                    message: "Thiếu Refresh Token",
                  },
                },
                invalidLen: {
                  value: {
                    success: false,
                    code: "AUTH_408",
                    statusCode: 400,
                    message: "Refresh token không hợp lệ",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  [`/auth/logout`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Đăng xuất",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Đăng xuất thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthStandardResponse" },
            },
          },
        },
      },
    },
  },

  // ============================================================================
  // 3. FLOW QUÊN MẬT KHẨU
  // ============================================================================
  [`/auth/forgot-password`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Yêu cầu khôi phục mật khẩu",
      requestBody: {
        required: true,
        // Đã bổ sung requestBody
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { email: { type: "string" } },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP khôi phục đã được gửi",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthStandardResponse" },
            },
          },
        },
      },
    },
  },

  [`/auth/reset-password`]: {
    post: {
      tags: ["Auth (Public)"],
      summary: "Thiết lập mật khẩu mới",
      requestBody: {
        required: true,
        // Dùng đúng ResetPasswordInputDTO
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ResetPasswordInputDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Đổi mật khẩu thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthStandardResponse" },
            },
          },
        },
        400: {
          description: "Lỗi nghiệp vụ",
          content: {
            "application/json": {
              examples: {
                emailReq: {
                  value: {
                    success: false,
                    code: "AUTH_101",
                    statusCode: 400,
                    message: "Email là bắt buộc",
                  },
                },
                otpReq: {
                  value: {
                    success: false,
                    code: "AUTH_103",
                    statusCode: 400,
                    message: "Mã OTP là bắt buộc",
                  },
                },
                newPassReq: {
                  value: {
                    success: false,
                    code: "AUTH_107",
                    statusCode: 400,
                    message: "Mật khẩu mới là bắt buộc",
                  },
                },
                otpInv: {
                  value: {
                    success: false,
                    code: "AUTH_104",
                    statusCode: 400,
                    message: "Mã OTP sai",
                  },
                },
                passWeak: {
                  value: {
                    success: false,
                    code: "AUTH_108",
                    statusCode: 400,
                    message: "Mật khẩu quá yếu",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
