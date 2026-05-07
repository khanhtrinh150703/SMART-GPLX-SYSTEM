export const activeSessionSchemas = {
  /**
   * @description Chi tiết câu trả lời đã lưu trong phiên nháp
   */
  ActiveSessionAnswerDTO: {
    type: "object",
    properties: {
      questionId: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      selectedAnswerIndex: {
        type: "integer",
        nullable: true,
        example: 2,
        description:
          "Vị trí đáp án đã chọn (Lưu ý comment trong code: Có thể chuyển sang dùng ID)",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Thời điểm cuối cùng client sync câu trả lời này",
      },
    },
  },

  /**
   * @description Dữ liệu trả về cho một phiên làm bài dở dang
   */
  ActiveSessionResponseDTO: {
    type: "object",
    properties: {
      sessionId: {
        type: "string",
        description: "ID của phiên làm việc (Sinh từ NoSQL/Redis)",
      },
      examId: {
        type: "string",
        format: "uuid",
        example: "77912c77-8a44-4205-af6c-8746c8a157b1",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Thời điểm bắt đầu phiên thi",
      },
      serverTime: {
        type: "string",
        format: "date-time",
        description: "Thời gian hiện tại của Server để FE đồng bộ Countdown",
      },
      currentAnswers: {
        type: "array",
        items: { $ref: "#/components/schemas/ActiveSessionAnswerDTO" },
        description: "Danh sách các câu đã làm lưu trong nháp",
      },
    },
  },

  /**
   * @description Lớp bao đóng chuẩn (Wrapper) cho phản hồi Session
   */
  ActiveSessionSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ActiveSessionResponseDTO" },
        },
      },
    ],
  },
  /**
   * @description DTO khởi tạo phiên làm bài (Dùng chung cho Guest và User)
   */
  StartSessionRequest: {
    type: "object",
    required: ["examId"],
    properties: {
      examId: {
        type: "string",
        format: "uuid",
        example: "77912c77-8a44-4205-af6c-8746c8a157b1",
        description: "ID của bộ đề muốn bắt đầu thi",
      },
    },
  },
};
