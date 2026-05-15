import { securityResponses, deleteResponse } from "../swaggerHelpers";

export const questionPaths = {
  [`/questions/chapter/{chapterId}`]: {
    get: {
      tags: ["Question (Public)"],
      summary: "Lấy câu hỏi theo chương",
      parameters: [
        {
          name: "chapterId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuestionListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // ============================================================================
  // 2. QUẢN LÝ DANH SÁCH (CRUD ROOT)
  // ============================================================================

  [`/questions`]: {
    get: {
      tags: ["Question (Private)"],
      summary: "Lấy danh sách câu hỏi (Admin/Instructor)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "chapterId", in: "query", schema: { type: "string" } },
        {
          name: "licenseCategoryIds",
          in: "query",
          schema: { type: "string" },
          description: "Lọc theo hạng bằng (VD: B1,B2)",
        },
        { name: "difficultyLevel", in: "query", schema: { type: "integer" } },
        { name: "isCritical", in: "query", schema: { type: "boolean" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuestionListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
    post: {
      tags: ["Question (Private)"],
      summary: "Tạo mới câu hỏi",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                chapterId: { type: "string", format: "uuid" },
                content: { type: "string", minLength: 10 },
                answers: {
                  type: "string",
                  description: "JSON String của mảng IAnswerResponseDTO",
                },
                licenseCategoryIds: {
                  type: "array",
                  items: { type: "string" },
                },
                isCritical: { type: "boolean" },
                difficultyLevel: { type: "integer" },
                questionImage: { type: "string", format: "binary" },
              },
              required: [
                "chapterId",
                "content",
                "answers",
                "licenseCategoryIds",
                "isCritical",
              ],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuestionSingleResponse" },
            },
          },
        },
        400: {
          description: "Lỗi dữ liệu đầu vào & Nghiệp vụ",
          content: {
            "application/json": {
              examples: {
                // --- NHÓM 1XX: VALIDATION ---
                chapterReq: {
                  value: {
                    success: false,
                    code: "QST_001",
                    statusCode: 400,
                    message: "Thiếu ID chương",
                  },
                },
                contentInv: {
                  value: {
                    success: false,
                    code: "QST_002",
                    statusCode: 400,
                    message: "Nội dung câu hỏi quá ngắn",
                  },
                },
                licenseReq: {
                  value: {
                    success: false,
                    code: "QST_003",
                    statusCode: 400,
                    message: "Thiếu hạng bằng lái áp dụng",
                  },
                },
                ansInsu: {
                  value: {
                    success: false,
                    code: "QST_004",
                    statusCode: 400,
                    message: "Số lượng đáp án phải từ 2 trở lên",
                  },
                },
                correctMissing: {
                  value: {
                    success: false,
                    code: "QST_005",
                    statusCode: 400,
                    message: "Câu hỏi chưa có đáp án đúng",
                  },
                },
                imgInv: {
                  value: {
                    success: false,
                    code: "QST_006",
                    statusCode: 400,
                    message: "Link ảnh hoặc định dạng ảnh không hợp lệ",
                  },
                },

                // --- NHÓM 1XX: LOGIC & FORMAT ---
                multiCorrect: {
                  value: {
                    success: false,
                    code: "QST_102",
                    statusCode: 400,
                    message: "Chỉ được phép có duy nhất 1 đáp án đúng",
                  },
                },
                ansContentReq: {
                  value: {
                    success: false,
                    code: "QST_103",
                    statusCode: 400,
                    message: "Nội dung đáp án không được để trống",
                  },
                },
                diffInv: {
                  value: {
                    success: false,
                    code: "QST_106",
                    statusCode: 400,
                    message: "Mức độ khó không hợp lệ",
                  },
                },
                criticalInv: {
                  value: {
                    success: false,
                    code: "QST_109",
                    statusCode: 400,
                    message: "Giá trị điểm liệt phải là True hoặc False",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Lỗi xung đột dữ liệu",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "QST_409",
                statusCode: 409,
                message: "Nội dung câu hỏi này đã tồn tại trong hệ thống",
              },
            },
          },
        },
        500: {
          description: "Lỗi hệ thống",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "QST_500",
                statusCode: 500,
                message: "Lỗi đồng bộ dữ liệu đáp án",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  // ============================================================================
  // 3. CHI TIẾT & THAO TÁC THEO ID
  // ============================================================================

  [`/questions/{id}`]: {
    get: {
      tags: ["Question (Public)"],
      summary: "Chi tiết câu hỏi",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuestionSingleResponse" },
            },
          },
        },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "QST_404",
                statusCode: 404,
                message: "Câu hỏi không tồn tại",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
    put: {
    tags: ["Question (Private)"],
    summary: "Cập nhật câu hỏi",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "ID của câu hỏi cần cập nhật"
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              // Tui tách nhỏ các field thay vì dùng Ref DTO để hỗ trợ binary file dễ nhìn trên UI
              chapterId: { type: "string", format: "uuid" },
              content: { type: "string", minLength: 10 },
              answers: { type: "string", description: "JSON String mảng đáp án" },
              licenseCategoryIds: { type: "array", items: { type: "string" } },
              isCritical: { type: "boolean" },
              difficultyLevel: { type: "integer" },
              indexNumber: { type: "integer" },
              questionImage: { type: "string", format: "binary", description: "Ảnh mới (nếu có)" }
            }
          }
        }
      }
    },
    responses: {
      200: { 
        description: "Cập nhật thành công",
        content: { "application/json": { schema: { $ref: "#/components/schemas/QuestionSingleResponse" } } }
      },
      400: {
        description: "Lỗi xác thực dữ liệu & Logic cập nhật",
        content: {
          "application/json": {
            examples: {
              // --- LỖI ĐỊNH DANH ---
              idReq: { value: { success: false, code: "QST_100", statusCode: 400, message: "Thiếu ID câu hỏi để cập nhật" } },
              
              // --- LỖI NỘI DUNG & CHƯƠNG ---
              chapterReq: { value: { success: false, code: "QST_001", statusCode: 400, message: "Thiếu ID chương" } },
              contentInv: { value: { success: false, code: "QST_002", statusCode: 400, message: "Nội dung câu hỏi không hợp lệ" } },
              
              // --- LỖI ĐÁP ÁN ---
              ansInsu: { value: { success: false, code: "QST_004", statusCode: 400, message: "Số lượng đáp án không đủ (tối thiểu 2)" } },
              correctMissing: { value: { success: false, code: "QST_005", statusCode: 400, message: "Phải có ít nhất 1 đáp án đúng" } },
              multiCorrect: { value: { success: false, code: "QST_102", statusCode: 400, message: "Luật mới chỉ cho phép duy nhất 1 đáp án đúng" } },
              ansContent: { value: { success: false, code: "QST_103", statusCode: 400, message: "Nội dung đáp án không được để trống" } },

              // --- LỖI CHỈ SỐ & KIỂU DỮ LIỆU ---
              diffInv: { value: { success: false, code: "QST_106", statusCode: 400, message: "Mức độ khó không hợp lệ" } },
              indexInv: { value: { success: false, code: "QST_107", statusCode: 400, message: "Số thứ tự câu hỏi không hợp lệ" } },
              criticalInv: { value: { success: false, code: "QST_109", statusCode: 400, message: "Giá trị câu hỏi điểm liệt phải là boolean" } }
            }
          }
        }
      },
      404: {
        description: "Không tìm thấy câu hỏi",
        content: {
          "application/json": {
            example: { success: false, code: "QST_404", statusCode: 404, message: "Câu hỏi không tồn tại trong hệ thống" }
          }
        }
      },
      ...securityResponses
    }},
    delete: {
      tags: ["Question (Private)"],
      summary: "Xóa mềm câu hỏi",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        ...deleteResponse,
        ...securityResponses,
      },
    },
  },

  [`/questions/{id}/restore`]: {
    patch: {
      tags: ["Question (Private)"],
      summary: "Khôi phục câu hỏi",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Khôi phục thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuestionSingleResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },
};
