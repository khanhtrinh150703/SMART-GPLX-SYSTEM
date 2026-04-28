export const authSchemas = {
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

  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'Mã Refresh Token được cấp khi đăng nhập',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        minLength: 40
      },
    },
  },
  // Cấu trúc dữ liệu trả về khi thành công
  TokenResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'Mã truy cập mới dùng để gọi các API bảo mật',
        example: 'eyJhbGciOiJIUzI1Ni...'
      },
      refreshToken: {
        type: 'string',
        description: 'Mã làm mới mới (Nếu hệ thống dùng cơ chế xoay vòng)',
        example: 'eyJhbGciOiJIUzI1Ni...'
      },
    },
  },
  // Schema chung cho các phản hồi thành công khác (nếu cần)
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Thao tác thành công' },
    }
  }
};