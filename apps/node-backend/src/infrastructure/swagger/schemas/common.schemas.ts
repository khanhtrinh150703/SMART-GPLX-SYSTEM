export const commonSchemas = {
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
};