export const commonSchemas = {
  SuccessResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SYS_000" },
      statusCode: { type: "number", example: 200 },
      message: { type: "string", example: "Thao tác thực hiện thành công" },
      data: { type: "object", nullable: true },
    },
  },

  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      code: { type: "string", example: "ERR_001" },
      statusCode: { type: "number", example: 400 },
      message: { type: "string", example: "Lỗi xảy ra" },
    },
  },

  StandardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SYS_000" },
      statusCode: { type: "number", example: 200 },
      message: { type: "string", example: "Thao tác thực hiện thành công" },
    },
  },

  SelectionDTO: {
    type: "object",
    properties: {
      value: {
        type: "string",
        description: "ID của bản ghi (Dùng làm giá trị chọn)",
      },
      label: {
        type: "string",
        description: "Tên hiển thị (Dùng để hiển thị lên UI)",
      },
    },
  },

  SelectionListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SUCCESS" },
      message: { type: "string", example: "Lấy danh sách thành công" },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/SelectionDTO" },
      },
    },
  },
  /**
   * @description Schema cho DeleteResponseDTO
   */
  /**
   * @description Schema phản hồi kết quả xóa (Hỗ trợ cả Xóa mềm và Xóa cứng)
   */
  DeleteResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      type: { type: "string", enum: ["SOFT", "HARD"] },
      message: { type: "string" },
    },
  },

  DeleteResultResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/DeleteResponseDTO" },
        },
      },
    ],
  },

  UnauthorizedError: {
    description: "Lỗi chưa đăng nhập hoặc Token hết hạn",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/AuthErrorResponse" },
        examples: {
          unauth: {
            value: {
              success: false,
              code: "AUTH_401",
              statusCode: 401,
              message: "Chưa đăng nhập",
            },
          },
          expired: {
            value: {
              success: false,
              code: "AUTH_402",
              statusCode: 401,
              message: "Token hết hạn",
            },
          },
        },
      },
    },
  },
  ForbiddenError: {
    description: "Lỗi không đủ quyền truy cập",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/AuthErrorResponse" },
        example: {
          success: false,
          code: "AUTH_403",
          statusCode: 403,
          message: "Không có quyền thực hiện hành động này",
        },
      },
    },
  },
  /**
   * @description Dữ liệu mô tả phân trang (Metadata)
   */
  PaginationMeta: {
    type: "object",
    properties: {
      totalRecords: {
        type: "integer",
        example: 100,
        description: "Tổng số bản ghi tìm thấy",
      },
      totalPages: {
        type: "integer",
        example: 10,
        description: "Tổng số trang",
      },
      currentPage: {
        type: "integer",
        example: 1,
        description: "Trang hiện tại",
      },
      limit: {
        type: "integer",
        example: 10,
        description: "Số bản ghi trên một trang",
      },
      hasNextPage: { type: "boolean", example: true },
      hasPreviousPage: { type: "boolean", example: false },
    },
  },

  /**
   * @description Cấu trúc phản hồi danh sách chuẩn (Wrapper)
   * Ông có thể dùng cái này để bọc bất kỳ mảng dữ liệu nào.
   */
  PaginatedResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      code: { type: "string", example: "SUCCESS" },
      message: { type: "string", example: "Lấy danh sách thành công" },
      data: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { type: "object" },
            description: "Mảng dữ liệu thực tế",
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" }, // <--- Đã có "hộ khẩu" ở trên
        },
      },
    },
  },
  /**
   * @description Schema dành riêng cho các lỗi liên quan đến Token và Quyền hạn
   */
  AuthErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      code: {
        type: "string",
        example: "AUTH_UNAUTHORIZED",
        description: "Mã lỗi định danh (VD: AUTH_401, AUTH_403)",
      },
      statusCode: {
        type: "integer",
        example: 401,
      },
      message: {
        type: "string",
        example: "Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập.",
      },
    },
  },
  // 1. DTO đơn lẻ (Bám sát IExamMatrixSelectionResponseDTO)
  ExamMatrixSelectionDTO: {
    type: "object",
    allOf: [
      { $ref: "#/components/schemas/SelectionDTO" }, // Lấy value, label, orderIndex
      {
        type: "object",
        properties: {
          licenseCategoryName: { type: "string", example: "Hạng B2" },
          licenseCategoryId: { type: "string", format: "uuid" },
          totalQuestions: { type: "number", example: 35 },
          durationMinutes: { type: "number", example: 22 },
          passingScore: { type: "number", example: 32 },
          minCriticalQuestions: { type: "number", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    ],
  },

  // 2. Response bọc danh sách
  ExamMatrixSelectionListResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/ExamMatrixSelectionDTO" },
          },
        },
      },
    ],
  },
};

export const commonResponses = {
  DeleteSuccessResponse: {
    description: "Thao tác xóa thành công (Hỗ trợ Soft/Hard Delete)",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/DeleteResultResponse" },
        examples: {
          softDelete: {
            summary: "Kịch bản: Xóa mềm",
            description: "Bản ghi có dữ liệu ràng buộc nên chỉ bị ẩn đi.",
            value: {
              success: true,
              code: "SUCCESS",
              statusCode: 200,
              message: "Thao tác thành công",
              data: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                type: "SOFT",
                message: "Bản ghi đã được chuyển vào thùng rác.",
              },
            },
          },
          hardDelete: {
            summary: "Kịch bản: Xóa vĩnh viễn",
            description: "Bản ghi sạch, hệ thống xóa bỏ hoàn toàn khỏi DB.",
            value: {
              success: true,
              code: "SUCCESS",
              statusCode: 200,
              message: "Thao tác thành công",
              data: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                type: "HARD",
                message: "Bản ghi đã được xóa vĩnh viễn khỏi hệ thống.",
              },
            },
          },
        },
      },
    },
  },
};
