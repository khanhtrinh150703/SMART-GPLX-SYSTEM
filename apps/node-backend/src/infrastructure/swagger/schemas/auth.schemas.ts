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
};