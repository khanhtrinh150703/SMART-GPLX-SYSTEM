export const examAttemptSchemas = {
  /**
   * @description DTO cấu trúc nộp bài (Sử dụng chung cho User và Guest)
   */
  SubmitAttemptRequest: {
    type: "object",
    required: ["examId", "answers", "durationSeconds"],
    properties: {
      examId: { type: "string", format: "uuid" },
      durationSeconds: {
        type: "integer",
        minimum: 1,
        example: 1185,
        description: "Thời gian đã làm bài (giây)",
      },
      answers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            questionId: { type: "string", format: "uuid" },
            selectedAnswerIndex: { type: "integer", nullable: true },
          },
        },
      },
    },
  },

  /**
   * @description Lựa chọn đáp án trong Snapshot (Review)
   */
  AnswerSnapshotDTO: {
    type: "object",
    properties: {
      answerIndex: { type: "integer", example: 1 },
      content: { type: "string", example: "Dừng lại trước vạch dừng." },
      imageUrl: { type: "string", nullable: true },
    },
  },

  /**
   * @description Chi tiết câu hỏi và đối chiếu đáp án đúng/sai (Review)
   */
  QuestionSnapshotDTO: {
    type: "object",
    properties: {
      questionId: { type: "string", format: "uuid" },
      indexNumber: { type: "integer", example: 1 },
      content: { type: "string" },
      imageUrl: { type: "string", nullable: true },
      isCritical: { type: "boolean", example: false },
      chapterId: { type: "string", format: "uuid" },
      chapterName: { type: "string" },
      options: {
        type: "array",
        items: { $ref: "#/components/schemas/AnswerSnapshotDTO" },
      },
      selectedAnswerIndex: { type: "integer", nullable: true, example: 2 },
      correctAnswerIndex: { type: "integer", example: 2 },
      isCorrect: { type: "boolean", example: true },
      explanation: { type: "string", nullable: true },
    },
  },

  /**
   * @description Dữ liệu trả về đầy đủ cho một lượt thi (Dashboard / Review)
   */
  ExamAttemptResponseDTO: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      userName: { type: "string" },
      examId: { type: "string", format: "uuid" },
      examTitle: { type: "string" },
      licenseCategoryName: { type: "string", example: "Hạng B2" },
      score: { type: "integer", example: 34 },
      correctCount: { type: "integer", example: 34 },
      wrongCount: { type: "integer", example: 1 },
      skippedCount: { type: "integer", example: 0 },
      totalQuestions: { type: "integer", example: 35 },
      passingScore: { type: "integer", example: 32 },
      isPassed: { type: "boolean", example: true },
      hasFailedCritical: { type: "boolean", example: false },
      durationSeconds: { type: "integer", example: 1185 },
      durationFormatted: { type: "string", example: "19:45" },
      isAutoSubmit: { type: "boolean", example: false },
      submittedAt: { type: "string", format: "date-time" },
      questions: {
        type: "array",
        items: { $ref: "#/components/schemas/QuestionSnapshotDTO" },
      },
    },
  },

  // --- WRAPPERS (LỚP BAO ĐÓNG PHẢN HỒI) ---

  ExamAttemptSingleResponse: {
    allOf: [
      { $ref: "#/components/schemas/StandardResponse" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ExamAttemptResponseDTO" },
        },
      },
    ],
  },

  ExamAttemptListResponse: {
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
                items: { $ref: "#/components/schemas/ExamAttemptResponseDTO" },
              },
              meta: { $ref: "#/components/schemas/PaginationMeta" },
            },
          },
        },
      },
    ],
  },
};
