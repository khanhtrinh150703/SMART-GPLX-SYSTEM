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
            '400': { $ref: '#/components/responses/ValidationError' },
            '409': { $ref: '#/components/responses/ConflictError' }
          }
        }
      },
      // BỔ SUNG THÊM LOGIN
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User Login', // Nghĩa: Đăng nhập người dùng
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', example: 'trinh_v1' },
                    password: { type: 'string', example: 'Password123' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { type: 'object' },
                              accessToken: { type: 'string', example: 'eyJhbGci...' }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized', // Nghĩa: Không được phép/Sai thông tin
              content: {
                'application/json': {
                  example: { success: false, code: 'AUTH_001', statusCode: 401, message: 'Tài khoản hoặc mật khẩu không chính xác' }
                }
              }
            }
          }
        }
      },
      // --- USER MANAGEMENT (Bổ sung mới) ---
      '/users/{id}/profile': {
        patch: {
          tags: ['User Management'],
          summary: 'Update user profile',
          description: 'Cập nhật thông tin cá nhân (fullName, urlPicture).',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID người dùng' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    fullName: { type: 'string', example: 'Trinh Update V2' },
                    urlPicture: { type: 'string', example: 'https://example.com/avatar.png' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Profile updated successfully', // Nghĩa: Cập nhật hồ sơ thành công
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } }
            }
          }
        }
      },

      '/users/{id}/password': {
        patch: {
          tags: ['User Management'],
          summary: 'Change password',
          description: 'Thay đổi mật khẩu người dùng.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    oldPassword: { type: 'string', example: 'Password123' },
                    newPassword: { type: 'string', example: 'NewPassword123!' },
                    confirmNewPassword: { type: 'string', example: 'NewPassword123!' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Password changed successfully' },
            '400': {
              description: 'Bad Request - Password mismatch', // Nghĩa: Yêu cầu không hợp lệ - Mật khẩu không khớp
              content: { 'application/json': { example: { success: false, code: 'VAL_103', message: 'Mật khẩu xác nhận không khớp' } } }
            },
            '401': { description: 'Unauthorized - Incorrect old password' } // Nghĩa: Sai mật khẩu cũ
          }
        }
      },

      '/users/{id}/status': {
        patch: {
          tags: ['User Management'],
          summary: 'Update user status',
          description: 'Cập nhật trạng thái tài khoản (ví dụ: ACTIVE, BANNED).',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['ACTIVE', 'BANNED', 'INACTIVE'], example: 'BANNED' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Status updated successfully' }
          }
        }
      },

      '/users/{id}': {
        delete: {
          tags: ['User Management'],
          summary: 'Soft delete user',
          description: 'Xóa mềm tài khoản người dùng khỏi hệ thống.',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            '200': {
              description: 'User deleted successfully', // Nghĩa: Xóa người dùng thành công
              content: { 'application/json': { example: { success: true, message: 'Xóa tài khoản thành công' } } }
            }
          }
        }
      }
    },


    components: {
      responses: {
        ValidationError: {
          description: 'Validation Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                invalidEmail: { value: { success: false, code: 'VAL_101', statusCode: 400, message: 'Email không hợp lệ' } },
                weakPassword: { value: { success: false, code: 'VAL_102', statusCode: 400, message: 'Mật khẩu quá yếu' } }
              }
            }
          }
        },
        ConflictError: {
          description: 'Conflict',
          content: {
            'application/json': {
              example: { success: false, code: 'USER_409', statusCode: 409, message: 'Email/Username đã tồn tại' }
            }
          }
        }
      },
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
            code: { type: 'string' },
            statusCode: { type: 'number' },
            message: { type: 'string' }
          }
        }
      },
    },
  },
  apis: [], // Nếu đã viết paths ở trên thì nên để trống hoặc trỏ đúng chỗ
};

export const specs = swaggerJsdoc(options);