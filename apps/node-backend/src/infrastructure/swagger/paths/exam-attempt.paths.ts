import { securityResponses } from "../swaggerHelpers";

export const examAttemptPaths = {
  /**
   * ==========================================
   * NHÓM PUBLIC (KHÁCH THI THỬ)
   * ==========================================
   */
  [`/exam-attempts/guest/complete`]: {
    post: {
      tags: ["Exam Attempt (Public)"],
      summary: "Nộp bài và chấm điểm (Khách)",
      description:
        "Trả về kết quả chấm điểm tức thì. KHÔNG lưu lịch sử vào Database.",
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SubmitAttemptRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Chấm điểm thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ExamAttemptSingleResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi logic chấm điểm",
          content: {
            "application/json": {
              examples: {
                notInProgress: {
                  value: {
                    success: false,
                    code: "EXA_006",
                    message: "Phiên thi không ở trạng thái hợp lệ để nộp",
                  },
                },
                consistencyErr: {
                  value: {
                    success: false,
                    code: "EXA_005",
                    message: "Phát hiện bất thường trong dữ liệu chấm điểm",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  /**
   * ==========================================
   * NHÓM PRIVATE (HỌC VIÊN CHÍNH THỨC)
   * ==========================================
   */
  [`/exam-attempts/history`]: {
    get: {
      tags: ["Exam Attempt (Private)"],
      summary: "Lấy danh sách lịch sử làm bài",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExamAttemptListResponse" },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/exam-attempts/complete`]: {
    post: {
      tags: ["Exam Attempt (Private)"],
      summary: "Nộp bài thi & Lưu Snapshot",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SubmitAttemptRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Chấm điểm và lưu kết quả thành công",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ExamAttemptSingleResponse",
              },
            },
          },
        },
        400: {
          description: "Lỗi Data Integrity",
          content: {
            "application/json": {
              examples: {
                scoreInv: {
                  value: {
                    success: false,
                    code: "EXA_004",
                    message: "Dữ liệu điểm số tính toán không hợp lệ",
                  },
                },
                consistencyErr: {
                  value: {
                    success: false,
                    code: "EXA_005",
                    message: "Có sự sai lệch giữa kết quả chấm và tổng số câu",
                  },
                },
                notInProgress: {
                  value: {
                    success: false,
                    code: "EXA_006",
                    message: "Không tìm thấy phiên làm bài đang diễn ra",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Đã nộp bài",
          content: {
            "application/json": {
              example: {
                code: "EXA_002",
                message: "Lượt thi này đã được nộp trước đó",
              },
            },
          },
        },
        410: {
          description: "Hết giờ",
          content: {
            "application/json": {
              example: {
                code: "EXA_003",
                message: "Thời gian làm bài đã kết thúc",
              },
            },
          },
        },
        ...securityResponses,
      },
    },
  },

  [`/exam-attempts/{id}/detail`]: {
    get: {
      tags: ["Exam Attempt (Private)"],
      summary: "Xem chi tiết một bài làm cũ (Review)",
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
              schema: {
                $ref: "#/components/schemas/ExamAttemptSingleResponse",
              },
            },
          },
        },
        400: {
          description: "Thiếu ID",
          content: {
            "application/json": {
              example: { code: "EXA_000", message: "ID lượt thi là bắt buộc" },
            },
          },
        },
        401: securityResponses[401],
        403: {
          description: "Cấm truy cập",
          content: {
            "application/json": {
              example: {
                code: "EXA_007",
                message: "Bạn không có quyền xem bài làm của người khác",
              },
            },
          },
        },
        404: {
          description: "Không tìm thấy",
          content: {
            "application/json": {
              example: {
                code: "EXA_001",
                message: "Không tìm thấy kết quả lượt thi này",
              },
            },
          },
        },
      },
    },
  },
};
