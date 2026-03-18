import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart GPLX API',
      version: '1.0.0',
    },
    servers: [{ url: '/api/v1' }],
    // Đưa định nghĩa API vào trong thuộc tính "paths"
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Đăng ký thành viên mới',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterDTO'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Đăng ký thành công '
            },
            '400': {
              description: 'Dữ liệu không hợp lệ hoặc Email đã tồn tại'
            },
            '500': {
              description: 'Lỗi hệ thống rồi, kiểm tra lại server nhé'
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
            email: { type: 'string', example: 'trinh@example.com' },
            password: { type: 'string', example: 'Password123' },
            confirmPassword: { type: 'string', example: 'Password123' },
            fullName: { type: 'string', example: 'Trinh AI' },
          },
        },
      },
    },
  },
  apis: ['./src/api/routes/*.ts'], // Chỉ quét file Route
};

export const specs = swaggerJsdoc(options);