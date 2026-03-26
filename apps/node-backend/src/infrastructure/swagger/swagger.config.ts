import swaggerJsdoc from 'swagger-jsdoc';

const API_BASE = '/api/v1';

// ====================== PATHS (đưa ra ngoài) ======================
const paths = {
  // ====================== AUTHENTICATION ======================
  [`${API_BASE}/auth/register/init`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Đăng ký thành viên mới',
      description: 'Khởi tạo đăng ký và gửi OTP vào email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Đăng ký thành công, vui lòng kiểm tra OTP trong email',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '409': { $ref: '#/components/responses/ConflictError' },
      },
    },
  },

  [`${API_BASE}/auth/resend-otp`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Gửi lại mã OTP',
      description: 'Có cooldown 60 giây',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email', example: 'gasadas1234@gmail.com' },
              },
              required: ['email'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Mã OTP mới đã được gửi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '400': { description: 'Email không hợp lệ hoặc phiên đăng ký hết hạn' },
        '429': { $ref: '#/components/responses/TooManyRequestsError' },
      },
    },
  },

  [`${API_BASE}/auth/register/verify`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Xác thực OTP',
      description: 'Xác thực OTP để hoàn tất tạo tài khoản',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/VerifyUserDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Xác thực thành công, tài khoản đã được tạo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '400': { description: 'Mã OTP sai hoặc không hợp lệ' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '410': { description: 'Phiên đăng ký đã hết hạn (quá 10 phút)' },
      },
    },
  },

  [`${API_BASE}/auth/login`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Đăng nhập',
      description: 'Hỗ trợ đăng nhập bằng username hoặc email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Đăng nhập thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
    },
  },

  [`${API_BASE}/auth/logout`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Đăng xuất',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Đăng xuất thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
    },
  },

  // ====================== USER MANAGEMENT ======================
  [`${API_BASE}/users/me/profile`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Cập nhật thông tin cá nhân',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateProfileDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Cập nhật profile thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
      },
    },
  },

  [`${API_BASE}/users/me/password`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Đổi mật khẩu',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangePasswordDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Đổi mật khẩu thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '400': { description: 'Mật khẩu cũ sai hoặc mật khẩu mới không khớp' },
        '401': { description: 'Unauthorized - Sai mật khẩu cũ' },
      },
    },
  },

  [`${API_BASE}/users/{id}/status`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Cập nhật trạng thái tài khoản (Admin)',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangeStatusDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Cập nhật trạng thái thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
      },
    },
  },

  [`${API_BASE}/users/{id}`]: {
    delete: {
      tags: ['User Management'],
      summary: 'Xóa mềm tài khoản người dùng',
      description: 'Đánh dấu tài khoản đã xóa bằng cách gán timestamp vào trường deletedAt. Tài khoản sẽ không thể đăng nhập nhưng vẫn tồn tại trong DB.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID của người dùng cần xóa'
        },
      ],
      responses: {
        '200': {
          description: 'Xóa mềm thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { description: 'Không tìm thấy người dùng hoặc người dùng đã bị xóa trước đó' }
      },
    },
  },

  // --- Endpoint Hồi sinh (Restore) ---
  [`${API_BASE}/users/{id}/restore`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Khôi phục tài khoản đã xóa mềm',
      description: 'Gỡ bỏ đánh dấu xóa (set deletedAt = null) và kích hoạt lại tài khoản. Chỉ ADMIN mới có quyền thực hiện.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID của người dùng cần khôi phục'
        },
      ],
      responses: {
        '200': {
          description: 'Khôi phục tài khoản thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { description: 'Không tìm thấy bản ghi đã xóa để khôi phục' },
        '409': {
          description: 'Xung đột dữ liệu: Username hoặc Email của tài khoản này đã bị một tài khoản khác đang hoạt động chiếm dụng.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      },
    },
  },

  [`${API_BASE}/auth/forgot-password`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Bước 1: Yêu cầu gửi mã OTP quên mật khẩu',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ForgotPasswordDTO' },
          },
        },
      },
      responses: {
        '200': { description: 'OTP đã được gửi qua email' },
        '404': { description: 'Email không tồn tại trong hệ thống' },
        '429': { description: 'Gửi quá nhanh, đang bị khóa (Resend Lock)' },
      },
    },
  },

  [`${API_BASE}/auth/reset-password`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Bước 2: Xác thực OTP và đặt lại mật khẩu mới',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ResetPasswordDTO' },
          },
        },
      },
      responses: {
        '200': { description: 'Đặt lại mật khẩu thành công' },
        '400': { description: 'Mã OTP sai hoặc đã hết hạn' },
      },
    },
  },
};

// ====================== SWAGGER CONFIG ======================
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart GPLX API',
      version: '1.0.0',
      description: 'API Documentation for Smart GPLX Management System',
    },
    servers: [{ url: API_BASE, description: 'Development Server' }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      responses: {
        ValidationError: {
          description: 'Dữ liệu không hợp lệ',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        UnauthorizedError: {
          description: 'Không có quyền truy cập hoặc sai thông tin',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        ConflictError: {
          description: 'Dữ liệu đã tồn tại',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        TooManyRequestsError: {
          description: 'Thao tác quá nhanh (cooldown)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },

      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SYS_000' },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Thao tác thực hiện thành công' },
            data: { type: 'object' },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'string' },
            statusCode: { type: 'number' },
            message: { type: 'string' },
          },
        },

        RegisterDTO: {
          type: 'object',
          required: ['username', 'email', 'password', 'confirmPassword'],
          properties: {
            username: { type: 'string', example: 'cauvang' },
            email: { type: 'string', format: 'email', example: 'trinh@example.com' },
            password: { type: 'string', format: 'password', example: 'Password123' },
            confirmPassword: { type: 'string', format: 'password', example: 'Password123' },
            fullName: { type: 'string', example: 'Trinh AI' },
          },
        },

        LoginDTO: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'trinh_cau_vang hoặc email' },
            password: { type: 'string', format: 'password', example: 'Password123' },
          },
        },

        LoginResponse: {
          allOf: [
            { $ref: '#/components/schemas/SuccessResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    user: { type: 'object' },
                  },
                },
              },
            },
          ],
        },

        VerifyUserDTO: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
          },
        },

        UpdateProfileDTO: {
          type: 'object',
          properties: {
            fullName: { type: 'string', example: 'Trinh Cậu Vàng V2' },
            urlPicture: { type: 'string', format: 'uri', example: 'https://example.com/avatar.png' },
          },
        },

        ChangePasswordDTO: {
          type: 'object',
          required: ['oldPassword', 'newPassword', 'confirmNewPassword'],
          properties: {
            oldPassword: { type: 'string', format: 'password' },
            newPassword: { type: 'string', format: 'password', minLength: 8 },
            confirmNewPassword: { type: 'string', format: 'password' },
          },
        },

        ChangeStatusDTO: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'],
              example: 'BANNED',
            },
          },
        },
        // DTO Bước 1: Chỉ cần Email
        ForgotPasswordDTO: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
          },
        },

        // DTO Bước 2: OTP + Pass mới
        ResetPasswordDTO: {
          type: 'object',
          required: ['email', 'otp', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            otp: { type: 'string', example: '123456', description: 'Mã 6 số từ Email' },
            newPassword: { type: 'string', example: 'NewPass789!!!' },
          },
        },
      },
    },

    paths,   // ← Gọi biến paths ở đây
  },
  apis: [], // Nếu sau này dùng JSDoc comment thì thêm đường dẫn vào đây
};

export const specs = swaggerJsdoc(options);