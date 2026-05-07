import { securityResponses, deleteResponse } from "../swaggerHelpers";

export const exanMatrixPaths = {
  /**
   * ==========================================
   * 1. DANH SÁCH & TẠO MỚI (ROOT)
   * ==========================================
   */
  [`/exam-matrices`]: {
    get: {
      tags: ["Exam Matrix (Private)"],
      summary: "Lấy danh sách ma trận (Dynamic Search)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "search", in: "query", schema: { type: "string" } },
        {
          name: "activeField",
          in: "query",
          schema: { type: "string" },
          description: "Trường lọc động (name, licenseCategoryId)",
        },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
    post: {
      tags: ["Exam Matrix (Private)"],
      summary: "Tạo mới ma trận đề thi",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateExamMatrixRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExamMatrixSingleResponse" },
            },
          },
        },
        400: {
          description: "Lỗi Xác thực & Nghiệp vụ (101 -> 114)",
          content: {
            "application/json": {
              examples: {
                // Nhóm 1xx: Validation cơ bản
                missingFields: {
                  value: {
                    success: false,
                    code: "MTX_111",
                    message:
                      "Thiếu các trường bắt buộc (name, licenseCategoryId, totalQuestions, ...)",
                  },
                },
                nameReq: {
                  value: {
                    success: false,
                    code: "MTX_101",
                    message: "Tên ma trận không được trống",
                  },
                },
                nameLong: {
                  value: {
                    success: false,
                    code: "MTX_102",
                    message: "Tên ma trận quá dài (max 100)",
                  },
                },
                licenseReq: {
                  value: {
                    success: false,
                    code: "MTX_110",
                    message: "Thiếu hạng bằng lái liên quan",
                  },
                },

                // Nhóm 1xx: Thông số kỹ thuật
                totalInv: {
                  value: {
                    success: false,
                    code: "MTX_107",
                    message: "Tổng số câu hỏi không hợp lệ (phải > 0)",
                  },
                },
                scoreInv: {
                  value: {
                    success: false,
                    code: "MTX_105",
                    message: "Điểm đạt không hợp lệ (phải > 0)",
                  },
                },
                scoreHigh: {
                  value: {
                    success: false,
                    code: "MTX_112",
                    message: "Điểm đạt vượt quá tổng số câu",
                  },
                },
                durationInv: {
                  value: {
                    success: false,
                    code: "MTX_108",
                    message: "Thời gian làm bài không hợp lệ (phải > 0)",
                  },
                },
                minCritInv: {
                  value: {
                    success: false,
                    code: "MTX_113",
                    message: "Số câu điểm liệt không hợp lệ",
                  },
                },
                isDefInv: {
                  value: {
                    success: false,
                    code: "MTX_114",
                    message: "Giá trị mặc định phải là Boolean",
                  },
                },

                // Nhóm 1xx: Logic Details (Chương & Tỉ lệ)
                noDetails: {
                  value: {
                    success: false,
                    code: "MTX_103",
                    message: "Ma trận không có chi tiết cấu trúc",
                  },
                },
                chapterReq: {
                  value: {
                    success: false,
                    code: "MTX_109",
                    message: "Thiếu ID chương trong danh sách chi tiết",
                  },
                },
                percentInv: {
                  value: {
                    success: false,
                    code: "MTX_104",
                    message:
                      "Tổng tỉ lệ phần trăm không bằng 100% hoặc tỉ lệ chương < 0",
                  },
                },
                dupChapter: {
                  value: {
                    success: false,
                    code: "MTX_106",
                    message: "Trùng lặp chương trong cùng một ma trận",
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

  /**
   * ==========================================
   * 2. CHI TIẾT & CẬP NHẬT (ID PATH)
   * ==========================================
   */
  [`/exam-matrices/{id}`]: {
    get: {
      tags: ["Exam Matrix (Private)"],
      summary: "Chi tiết ma trận theo ID",
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
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExamMatrixSingleResponse" },
            },
          },
        },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "MTX_404",
                message: "Không tìm thấy ma trận yêu cầu",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
    put: {
      tags: ["Exam Matrix (Private)"],
      summary: "Cập nhật ma trận",
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
            schema: { $ref: "#/components/schemas/CreateExamMatrixRequest" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
        400: {
          description: "Lỗi dữ liệu cập nhật (100 -> 114)",
          content: {
            "application/json": {
              examples: {
                idReq: {
                  value: {
                    success: false,
                    code: "MTX_100",
                    message: "Thiếu ID ma trận để cập nhật",
                  },
                },
                // Nhóm 1xx: Validation cơ bản
                missingFields: {
                  value: {
                    success: false,
                    code: "MTX_111",
                    message:
                      "Thiếu các trường bắt buộc (name, licenseCategoryId, totalQuestions, ...)",
                  },
                },
                nameReq: {
                  value: {
                    success: false,
                    code: "MTX_101",
                    message: "Tên ma trận không được trống",
                  },
                },
                nameLong: {
                  value: {
                    success: false,
                    code: "MTX_102",
                    message: "Tên ma trận quá dài (max 100)",
                  },
                },
                licenseReq: {
                  value: {
                    success: false,
                    code: "MTX_110",
                    message: "Thiếu hạng bằng lái liên quan",
                  },
                },

                // Nhóm 1xx: Thông số kỹ thuật
                totalInv: {
                  value: {
                    success: false,
                    code: "MTX_107",
                    message: "Tổng số câu hỏi không hợp lệ (phải > 0)",
                  },
                },
                scoreInv: {
                  value: {
                    success: false,
                    code: "MTX_105",
                    message: "Điểm đạt không hợp lệ (phải > 0)",
                  },
                },
                scoreHigh: {
                  value: {
                    success: false,
                    code: "MTX_112",
                    message: "Điểm đạt vượt quá tổng số câu",
                  },
                },
                durationInv: {
                  value: {
                    success: false,
                    code: "MTX_108",
                    message: "Thời gian làm bài không hợp lệ (phải > 0)",
                  },
                },
                minCritInv: {
                  value: {
                    success: false,
                    code: "MTX_113",
                    message: "Số câu điểm liệt không hợp lệ",
                  },
                },
                isDefInv: {
                  value: {
                    success: false,
                    code: "MTX_114",
                    message: "Giá trị mặc định phải là Boolean",
                  },
                },

                // Nhóm 1xx: Logic Details (Chương & Tỉ lệ)
                noDetails: {
                  value: {
                    success: false,
                    code: "MTX_103",
                    message: "Ma trận không có chi tiết cấu trúc",
                  },
                },
                chapterReq: {
                  value: {
                    success: false,
                    code: "MTX_109",
                    message: "Thiếu ID chương trong danh sách chi tiết",
                  },
                },
                percentInv: {
                  value: {
                    success: false,
                    code: "MTX_104",
                    message:
                      "Tổng tỉ lệ phần trăm không bằng 100% hoặc tỉ lệ chương < 0",
                  },
                },
                dupChapter: {
                  value: {
                    success: false,
                    code: "MTX_106",
                    message: "Trùng lặp chương trong cùng một ma trận",
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
                code: "MTX_404",
                message: "Không tìm thấy ma trận để sửa",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
    delete: {
      tags: ["Exam Matrix (Private)"],
      summary: "Xóa ma trận (Smart Delete)",
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
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "MTX_404",
                message: "Ma trận không tồn tại để xóa",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  /**
   * ==========================================
   * 3. KHÔI PHỤC (RESTORE)
   * ==========================================
   */
  [`/exam-matrices/{id}/restore`]: {
    patch: {
      tags: ["Exam Matrix (Private)"],
      summary: "Khôi phục ma trận đã xóa mềm",
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
        200: { description: "Khôi phục thành công" },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "MTX_404",
                message: "Ma trận không tồn tại trong thùng rác",
              },
            },
          },
        },
        409: {
          description: "Xung đột khi khôi phục",
          content: {
            "application/json": {
              example: {
                success: false,
                code: "MTX_409",
                message: "Khôi phục thất bại do trùng tên đã tồn tại",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },
};
