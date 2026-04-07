export const licenseSchemas = {
  // --- INPUT DTOs ---
  CreateLicenseCategoryDTO: {
    type: 'object',
    required: ['name', 'description', 'minAge'],
    properties: {
      name: { 
        type: 'string', 
        example: 'A1', 
        description: 'Tên hạng bằng lái (Viết hoa và số)' 
      },
      minAge: {
        type: 'integer',
        example: 18,
        description: 'Độ tuổi tối thiểu để được cấp bằng'
      },
      description: { 
        type: 'string', 
        example: 'Xe mô tô hai bánh có dung tích xi-lanh đến 125 cm3', 
        description: 'Mô tả chi tiết về phạm vi của hạng bằng' 
      },
    },
  },

  UpdateLicenseCategoryDTO: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'A1' },
      minAge: { type: 'integer', example: 18 },
      description: { type: 'string', example: 'Mô tả đã được cập nhật mới' },
    },
  },

  // --- DATA OBJECT (Phần "ruột" của data) ---
  LicenseCategoryDTO: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: 'aca0ad33-59bf-4d9f-b21d-6be1bc7b7c57' },
      name: { type: 'string', example: 'A1' },
      minAge: { type: 'integer', example: 18 },
      description: { type: 'string', example: 'Cấp cho người lái xe mô tô hai bánh...' },
      createdAt: { type: 'string', format: 'date-time', example: '2026-04-06T04:16:01.920Z' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  // --- RESPONSES (Cấu trúc trả về đầy đủ) ---
  LicenseCategoryResponse: {
    allOf: [
      { $ref: '#/components/schemas/StandardResponse' }, // Chứa success, code, statusCode, message
      {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/LicenseCategoryDTO' }, // Trả về 1 object đơn lẻ
        },
      },
    ],
  },

  LicenseCategoryListResponse: {
    allOf: [
      { $ref: '#/components/schemas/StandardResponse' },
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/LicenseCategoryDTO' }, // Trả về 1 mảng các object
          },
        },
      },
    ],
  },
};