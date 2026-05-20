import { deleteResponse, securityResponses } from "../helper/swaggerHelpers";

export const examPaths = {
  /**
   * ==========================================
   * NHÓM PUBLIC (DÀNH CHO THÍ SINH)
   * ==========================================
   */
  [`/exams/list`]: {
    get: {
      tags: ["Exam Client (Public)"],
      summary: "Truy vấn danh sách bộ đề công khai",
      description:
        "Dành cho thí sinh tìm kiếm bộ đề để luyện tập. Phân trang & Lọc theo hạng bằng.",
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        {
          name: "search",
          in: "query",
          schema: { type: "string" },
          description: "Tìm theo tên đề",
        },
        {
          name: "licenseCode",
          in: "query",
          schema: { type: "string" },
          description: "Lọc theo hạng A1, B2...",
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: {
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
                            items: {
                              $ref: "#/components/schemas/ExamSummaryDTO",
                            },
                          },
                          meta: { $ref: "#/components/schemas/PaginationMeta" },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },

  [`/exams/detail/{id}`]: {
    get: {
      tags: ["Exam Client (Public)"],
      summary: "Lấy chi tiết và nội dung câu hỏi để làm bài",
      description:
        "Trả về toàn bộ câu hỏi và các lựa chọn đáp án (Giấu đáp án đúng).",
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
              schema: { $ref: "#/components/schemas/ExamUserFullContentDTO" },
            },
          },
        },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "EXM_404",
                message: "Bộ đề không tồn tại",
              },
            },
          },
        },
      },
    },
  },

  /**
   * ==========================================
   * NHÓM PRIVATE (DÀNH CHO QUẢN TRỊ)
   * ==========================================
   */
  // --- GET EXAM LIST (ADMIN) ---
  [`/exams`]: {
    get: {
      tags: ["Exam Admin (Private)"],
      summary: "Truy vấn danh sách bài thi hệ thống",
      description:
        "Yêu cầu quyền `exams:read`. Dùng cho Admin theo dõi kết quả của tất cả User.",
      security: [{ bearerAuth: [] }],
      parameters: [
        // Base Query Params
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string", default: "createdAt" },
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
        },
        // Filter Params đặc thù
        {
          name: "name",
          in: "query",
          description: "Tìm kiếm theo tên bài thi",
          schema: { type: "string" },
        },
        {
          name: "statusExam",
          in: "query",
          description: "Lọc theo trạng thái bài thi",
          schema: { $ref: "#/components/schemas/ExamStatus" },
        },
        {
          name: "isPassed",
          in: "query",
          description: "Lọc theo kết quả đạt/trượt",
          schema: { type: "boolean" },
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExamPaginatedResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/exams/generate-auto`]: {
    post: {
      tags: ["Exam Admin (Private)"],
      summary: "Khởi tạo bài thi tự động từ Ma trận",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenerateExamRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Sinh đề thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExamResponseDTO" },
            },
          },
        },
        400: {
          description: "Lỗi nghiệp vụ khi bốc đề",
          content: {
            "application/json": {
              examples: {
                matrixInv: {
                  value: {
                    success: false,
                    code: "EXM_106",
                    message: "Mã ma trận không hợp lệ",
                  },
                },
                poolEmpty: {
                  value: {
                    success: false,
                    code: "EXM_201",
                    message: "Tổng kho không đủ câu hỏi",
                  },
                },
                chapterShort: {
                  value: {
                    success: false,
                    code: "EXM_202",
                    message: "Thiếu câu hỏi theo chương mục",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  [`/exams/manual`]: {
    post: {
      tags: ["Exam Admin (Private)"],
      summary: "Khởi tạo bài thi thủ công",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateManualExamRequest" },
          },
        },
      },
      responses: {
        201: { description: "Tạo đề thành công" },
        400: {
          description: "Lỗi logic xác thực dữ liệu đầu vào",
          content: {
            "application/json": {
              examples: {
                // 1. Kiểm tra định danh (EXM_104, 107, 108)
                nameReq: {
                  value: {
                    success: false,
                    code: "EXM_104",
                    message: "Tên không được để trống",
                  },
                },
                userReq: {
                  value: {
                    success: false,
                    code: "EXM_107",
                    message: "Thiếu ID người tạo bài thi",
                  },
                },
                licenseReq: {
                  value: {
                    success: false,
                    code: "EXM_108",
                    message: "Thiếu hạng bằng lái liên quan",
                  },
                },

                // 2. Kiểm tra logic danh sách (EXM_109)
                questionsEmpty: {
                  value: {
                    success: false,
                    code: "EXM_109",
                    message: "Danh sách câu hỏi hoặc Snapshot không được trống",
                  },
                },

                // 3. Kiểm tra thông số kỹ thuật (EXM_110, 111, 112)
                durationInv: {
                  value: {
                    success: false,
                    code: "EXM_110",
                    message: "Thời gian làm bài phải lớn hơn 0",
                  },
                },
                scoreHigh: {
                  value: {
                    success: false,
                    code: "EXM_111",
                    message: "Điểm đạt vượt quá tổng số câu hỏi hiện có",
                  },
                },
                minCritInv: {
                  value: {
                    success: false,
                    code: "EXM_112",
                    message: "Số câu hỏi điểm liệt tối thiểu không hợp lệ",
                  },
                },

                // Lỗi hệ thống nếu body rỗng
                invalidInput: {
                  value: {
                    success: false,
                    code: "SYS_400",
                    message: "Dữ liệu đầu vào không hợp lệ",
                  },
                },
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/exams/{id}`]: {
    patch: {
      tags: ["Exam Admin (Private)"],
      summary: "Cập nhật thông tin bài thi",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateExamRequest" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        400: {
          description: "Lỗi logic nghiệp vụ và xác thực dữ liệu",
          content: {
            "application/json": {
              examples: {
                // Nhóm 1xx: Định danh & Tên
                idReq: {
                  value: {
                    success: false,
                    code: "EXM_100",
                    message: "ID bài thi không được để trống",
                  },
                },
                nameReq: {
                  value: {
                    success: false,
                    code: "EXM_104",
                    message: "Tên bài thi không được để trống (nếu cập nhật)",
                  },
                },
                nameLong: {
                  value: {
                    success: false,
                    code: "EXM_105",
                    message: "Tên bài thi quá dài (max 100)",
                  },
                },
                userReq: {
                  value: {
                    success: false,
                    code: "EXM_107",
                    message: "Thiếu ID người phụ trách bài thi",
                  },
                },

                // Nhóm 1xx: Thông số & Logic chéo
                durationInv: {
                  value: {
                    success: false,
                    code: "EXM_110",
                    message: "Thời gian thi phải lớn hơn 0",
                  },
                },
                totalInv: {
                  value: {
                    success: false,
                    code: "EXM_114",
                    message: "Tổng số câu hỏi phải lớn hơn 0",
                  },
                },
                scoreHigh: {
                  value: {
                    success: false,
                    code: "EXM_111",
                    message:
                      "Điểm đạt vượt quá số lượng câu hỏi hiện có trong đề",
                  },
                },
                minCritInv: {
                  value: {
                    success: false,
                    code: "EXM_112",
                    message: "Số câu điểm liệt tối thiểu không được âm",
                  },
                },

                // Nhóm 1xx: Thời gian
                timeRange: {
                  value: {
                    success: false,
                    code: "EXM_113",
                    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "EXM_404",
                message: "Bài thi không tồn tại hoặc đã bị xóa",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
    delete: {
      tags: ["Exam Admin (Private)"],
      summary: "Xóa mềm bài thi",
      description:
        "Chuyển trạng thái bài thi thành đã xóa. Không thể xóa nếu bài thi đã có dữ liệu thí sinh làm bài.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID bài thi (UUID)",
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        ...deleteResponse,
        400: {
          description: "Vi phạm ràng buộc dữ liệu",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "EXAM_400", // Mã lỗi nghiệp vụ cho Exam
                statusCode: 400,
                message: "Không thể xóa bài thi đã có thí sinh tham gia",
              },
            },
          },
        },
        ...securityResponses, // Handle 401, 403 (licenses:manage hoặc exams:manage)
        404: {
          description: "Không tìm thấy bài thi",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "EXAM_404",
                statusCode: 404,
                message: "Không tìm thấy bài thi yêu cầu để xóa",
              },
            },
          },
        },
      },
    },
  },

  [`/exams/{id}/restore`]: {
    patch: {
      tags: ["Exam Admin (Private)"],
      summary: "Khôi phục bài thi đã xóa",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Khôi phục thành công" },
        404: {
          description: "Không tìm thấy trong thùng rác",
          content: {
            "application/json": {
              example: {
                code: "EXM_404",
                message: "Bài thi không tồn tại để khôi phục",
              },
            },
          },
        },
      },
    },
  },
};
