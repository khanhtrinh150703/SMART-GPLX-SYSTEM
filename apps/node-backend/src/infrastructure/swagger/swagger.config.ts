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
          description: 'Create a new user account with email and password complexity validation.',
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
                  schema: { $ref: '#/components/schemas/SuccessResponse' }
                }
              }
            },
            '400': {
              description: 'Validation Error (Invalid Email or Weak Password)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  examples: {
                    invalidEmail: {
                      summary: 'Invalid Email Format',
                      value: { success: false, code: 'VAL_001', statusCode: 400, message: 'Invalid email format' }
                    },
                    weakPassword: {
                      summary: 'Weak Password',
                      value: { success: false, code: 'VAL_002', statusCode: 400, message: 'Password is too weak' }
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
                  example: { success: false, code: 'USER_001', statusCode: 409, message: 'Email already exists' }
                }
              }
            },
            '500': {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: { success: false, code: 'SYS_500', statusCode: 500, message: 'Internal server error' }
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
            code: { type: 'string', example: 'SUC_000' },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'string', example: 'VAL_001' },
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Error message details' }
          }
        }
      },
    },
  },
  apis: ['./src/api/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);