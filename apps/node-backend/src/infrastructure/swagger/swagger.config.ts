import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart GPLX API',
      version: '1.0.0',
      description: 'API Documentation for Smart GPLX Management System',
    },
    servers: [{ url: '/api/v1', description: 'Development Server' }],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new member',
          description: 'Create a new user account with validated email, password, and confirm password.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterDTO' }
              }
            }
          },
          responses: {
            '200': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                  example: {
                    success: true,
                    code: 'SYS_000',
                    statusCode: 200,
                    message: 'Thao tác thực hiện thành công',
                    data: { userId: 'user_123', email: 'trinh@example.com' }
                  }
                }
              }
            },
            '400': { 
              description: 'Validation Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  examples: {
                    invalidEmail: {
                      summary: 'Email không hợp lệ',
                      value: { success: false, code: 'VAL_101', statusCode: 400, message: 'Địa chỉ email không đúng định dạng (ví dụ: abc@gmail.com)' }
                    },
                    weakPassword: {
                      summary: 'Mật khẩu yếu',
                      value: { success: false, code: 'VAL_102', statusCode: 400, message: 'Mật khẩu phải từ 8-20 ký tự, bao gồm chữ cái và số' }
                    },
                    passwordMismatch: {
                      summary: 'Mật khẩu không khớp',
                      value: { success: false, code: 'VAL_103', statusCode: 400, message: 'Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại' }
                    }
                  }
                }
              }
            },
            '409': {
              description: 'Conflict - Email already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { 
                    success: false, 
                    code: 'USER_409', 
                    statusCode: 409, 
                    message: 'Thông tin tài khoản hoặc email đã tồn tại trên hệ thống' 
                  }
                }
              }
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { 
                    success: false, 
                    code: 'SYS_500', 
                    statusCode: 500, 
                    message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau' 
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
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
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SYS_000' },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Thao tác thực hiện thành công' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'string', example: 'VAL_101' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Thông báo lỗi chi tiết' }
          }
        }
      },
    },
  },
  apis: ['./src/api/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);