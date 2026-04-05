export const userSchemas = {
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
      id: { type: 'string', format: 'uuid' },
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
};