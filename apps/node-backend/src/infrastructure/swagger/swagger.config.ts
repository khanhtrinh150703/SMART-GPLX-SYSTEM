import swaggerJsdoc from 'swagger-jsdoc';

const API_BASE = '/api/v1';

/**
 * ====================== OPENAPI PATHS ======================
 */
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
      summary: 'Xác thực OTP để hoàn tất đăng ký',
      description: 'Xác thực OTP để tạo tài khoản',
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

  // Forgot & Reset Password
  [`${API_BASE}/auth/forgot-password`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Yêu cầu gửi OTP quên mật khẩu',
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
        '429': { description: 'Gửi quá nhanh, đang bị khóa' },
      },
    },
  },

  [`${API_BASE}/auth/reset-password`]: {
    post: {
      tags: ['Authentication'],
      summary: 'Xác thực OTP và đặt lại mật khẩu mới',
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

  // ====================== USER MANAGEMENT ======================
  [`${API_BASE}/users/me/profile`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Cập nhật thông tin cá nhân',
      security: [{ bearerAuth: [] }],
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
        '400': { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  [`${API_BASE}/users/me/password`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Đổi mật khẩu',
      security: [{ bearerAuth: [] }],
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
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
    },
  },

  [`${API_BASE}/users/{id}/status`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Cập nhật trạng thái tài khoản (Admin only)',
      security: [{ bearerAuth: [] }],
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
        '403': { description: 'Không có quyền ADMIN' },
      },
    },
  },

  [`${API_BASE}/users/{id}`]: {
    delete: {
      tags: ['User Management'],
      summary: 'Xóa mềm tài khoản người dùng',
      description: 'Soft delete - Đánh dấu deletedAt',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID của người dùng cần xóa',
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
        '404': { description: 'Không tìm thấy người dùng' },
      },
    },
  },

  [`${API_BASE}/users/{id}/restore`]: {
    patch: {
      tags: ['User Management'],
      summary: 'Khôi phục tài khoản đã xóa mềm',
      description: 'Chỉ ADMIN mới có quyền thực hiện',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID của người dùng cần khôi phục',
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
        '404': { description: 'Không tìm thấy bản ghi đã xóa' },
        '409': {
          description: 'Xung đột dữ liệu: Username hoặc Email đã bị chiếm dụng',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },

  [`${API_BASE}/users`]: {
    get: {
      tags: ['User Management'],
      summary: 'Lấy danh sách người dùng có phân trang (Admin)',
      description: 'Yêu cầu quyền ADMIN. Hỗ trợ tìm kiếm và phân trang.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        '200': {
          description: 'Lấy danh sách thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserListResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '403': { description: 'Không có quyền ADMIN' },
      },
    },
  },

  // ====================== LICENSE CATEGORIES ======================
  [`${API_BASE}/license-categories`]: {
    get: {
      tags: ['License Category'],
      summary: 'Lấy danh sách hạng bằng lái',
      description: 'Trả về toàn bộ danh sách các hạng bằng lái đang hoạt động (chưa bị xóa mềm).',
      responses: {
        '200': {
          description: 'Thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LicenseCategoryListResponse' },
            },
          },
        },
      },
    },
    post: {
      tags: ['License Category'],
      summary: 'Tạo mới hạng bằng lái',
      description: 'Tạo một hạng bằng lái mới vào hệ thống. Yêu cầu quyền Quản trị viên.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateLicenseCategoryDTO' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Đã tạo thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardResponse' },
            },
          },
        },
        '409': {
          description: 'Tên đã tồn tại trong hệ thống',
        },
      },
    },
  },

  [`${API_BASE}/license-categories/{id}`]: {
    put: {
      tags: ['License Category'],
      summary: 'Cập nhật hạng bằng lái',
      description: 'Chỉnh sửa tên hoặc mô tả của hạng bằng lái hiện có.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'UUID của hạng bằng lái',
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateLicenseCategoryDTO' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Cập nhật thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['License Category'],
      summary: 'Xóa hạng bằng lái',
      description: 'Thực hiện xóa mềm hạng bằng lái. Hệ thống sẽ chặn xóa nếu có câu hỏi hoặc đề thi liên quan.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'UUID của hạng bằng lái',
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Xóa thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardResponse' },
            },
          },
        },
      },
    },
  },

  [`${API_BASE}/license-categories/{id}/restore`]: {
    patch: {
      tags: ['License Category'],
      summary: 'Khôi phục hạng bằng lái',
      description: 'Mở khóa (restore) hạng bằng lái đã bị xóa mềm trước đó.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'UUID của hạng bằng lái cần khôi phục',
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Khôi phục thành công',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardResponse' },
            },
          },
        },
      },
    },
  },
};

/**
 * ====================== SWAGGER CONFIG ======================
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart GPLX API',
      version: '1.0.0',
      description: 'API Documentation for Smart GPLX Management System',
    },
    servers: [
      {
        url: API_BASE,
        description: 'Development Server',
      },
    ],

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
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        UnauthorizedError: {
          description: 'Chưa xác thực hoặc token không hợp lệ',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        ConflictError: {
          description: 'Dữ liệu đã tồn tại',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        TooManyRequestsError: {
          description: 'Thao tác quá nhanh (cooldown)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },

      schemas: {
        // Common Responses
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SYS_000' },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Thao tác thực hiện thành công' },
            data: { type: 'object', nullable: true },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'string', example: 'ERR_001' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Lỗi xảy ra' },
          },
        },

        StandardResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SYS_000' },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Thao tác thực hiện thành công' },
          },
        },

        // Auth DTOs
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
            username: { type: 'string', example: 'trinh_cau_vang' },
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
                    user: { $ref: '#/components/schemas/UserResponseDTO' },
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

        ForgotPasswordDTO: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
          },
        },

        ResetPasswordDTO: {
          type: 'object',
          required: ['email', 'otp', 'newPassword'],
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', example: '123456' },
            newPassword: { type: 'string', minLength: 8, example: 'NewPass789!!!' },
          },
        },

        // User DTOs
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

        UserResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            urlPicture: { type: 'string' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'] },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        UserListResponse: {
          allOf: [
            { $ref: '#/components/schemas/SuccessResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/UserResponseDTO' },
                },
                meta: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 100 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 10 },
                  },
                },
              },
            },
          ],
        },

        // License Category Schemas
        CreateLicenseCategoryDTO: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: { type: 'string', example: 'B2', description: 'Tên hạng bằng (Viết hoa và số)' },
            description: { type: 'string', example: 'Xe ô tô dưới 9 chỗ', description: 'Mô tả chi tiết' },
          },
        },

        UpdateLicenseCategoryDTO: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'B2' },
            description: { type: 'string', example: 'Mô tả cập nhật mới' },
          },
        },

        LicenseCategoryListResponse: {
          allOf: [
            { $ref: '#/components/schemas/StandardResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },

    paths, // ← Đã merge đầy đủ
  },
  apis: [], // Nếu sau này dùng JSDoc thì thêm đường dẫn file vào đây
};

export const specs = swaggerJsdoc(options);