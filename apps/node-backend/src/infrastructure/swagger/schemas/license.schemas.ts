export const licenseSchemas = {
  CreateLicenseCategoryDTO: {
    type: 'object',
    required: ['name', 'description'],
    properties: {
      name: { 
        type: 'string', 
        example: 'B2', 
        description: 'Tên hạng bằng lái (Viết hoa và số)' 
      },
      description: { 
        type: 'string', 
        example: 'Xe ô tô chở người đến 9 chỗ ngồi', 
        description: 'Mô tả chi tiết về phạm vi của hạng bằng' 
      },
    },
  },

  UpdateLicenseCategoryDTO: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'B2' },
      description: { type: 'string', example: 'Mô tả đã được cập nhật mới' },
    },
  },

  LicenseCategoryResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
      name: { type: 'string', example: 'B2' },
      description: { type: 'string', example: 'Xe ô tô dưới 9 chỗ' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
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
            items: { $ref: '#/components/schemas/LicenseCategoryResponse' },
          },
        },
      },
    ],
  },
};  