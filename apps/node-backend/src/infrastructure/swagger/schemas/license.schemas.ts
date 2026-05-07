/**
 * @description Swagger configuration for License Categories Module
 * Project: Smart-GPLX-System
 * Role: Senior Backend Architect
 */

export const licenseSchemas = {
  // --- BASE WRAPPER ---
  StandardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SUCCESS" },
      statusCode: { type: "number", example: 200 },
      message: { type: "string", example: "Thao tác thành công" },
      permission: {
        type: "string",
        example: "licenses:manage",
        description: "Chỉ xuất hiện trong lỗi 403",
      },
    },
  },

  // --- CORE DOMAIN MODEL ---
  LicenseCategory: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      name: {
        type: "string",
        description: "Tên hạng bằng lái (VD: A1, B2, C)",
        example: "B2",
      },
      description: {
        type: "string",
        description: "Mô tả chi tiết về hạng bằng",
        example: "Xe ô tô chở người đến 9 chỗ ngồi...",
      },
      minAge: {
        type: "number",
        description: "Độ tuổi tối thiểu để thi hạng này",
        example: 18,
      },
      orderIndex: {
        type: "number",
        description: "Thứ tự hiển thị",
        example: 1,
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      deletedAt: { type: "string", format: "date-time", nullable: true },
    },
  },

  // --- INPUT DTOs (Bám sát hàm validate) ---
  CreateLicenseCategoryDTO: {
    type: "object",
    required: ["name", "description", "minAge"],
    properties: {
      name: {
        type: "string",
        maxLength: 10,
        example: "A1",
        description:
          "Bắt buộc (LIC_101), Max 10 ký tự (LIC_102), Đúng định dạng (LIC_103)",
      },
      description: {
        type: "string",
        maxLength: 500,
        description: "Bắt buộc (LIC_106), Max 500 ký tự (LIC_107)",
      },
      minAge: {
        type: "number",
        minimum: 18,
        default: 18,
        description: "Bắt buộc (LIC_104), Tối thiểu 18 tuổi (LIC_105)",
      },
      orderIndex: {
        type: "number",
        minimum: 0,
        default: 1,
        description: "Không được âm (LIC_108)",
      },
    },
  },

  UpdateLicenseCategoryDTO: {
    type: "object",
    required: ["id", "name", "description", "minAge", "orderIndex"],
    properties: {
      id: { type: "string", format: "uuid", description: "Bắt buộc (LIC_100)" },
      name: { type: "string", maxLength: 10 },
      description: { type: "string", maxLength: 500 },
      minAge: { type: "number", minimum: 18 },
      orderIndex: { type: "number", minimum: 0 },
    },
  },

  // --- RESPONSES ---
  LicenseCategoryResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/LicenseCategory" },
        },
      },
    ],
  },

  LicenseCategoryListResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/LicenseCategory" },
              },
              meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
          },
        },
      },
    ],
  },
};
