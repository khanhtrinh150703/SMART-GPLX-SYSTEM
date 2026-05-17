// tests/integration/payloads/exam-attempt.payload.ts

// 🚀 Hằng số UUID v4 chuẩn đét để bypass qua bộ lọc isUUID() của những trường không liên quan đến ca test
const VALID_UUID_V4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

export const EXAM_ATTEMPT_PAYLOAD = {
  // Luồng dữ liệu mặc định chuẩn hóa
  BASE_DATA: (examId: string, sessionId: string, questionId: string) => ({
    examId,
    sessionId,
    answers: [{ questionId, answer: 1, timeSpent: 10 }],
    timeSpent: 600,
    timeRemaining: 1200,
    isAutoSubmit: false,
    shouldShuffle: false,
    clientFinishedAt: new Date().toISOString(),
  }),

  // Bộ sinh lỗi validate từ hàm validate() của DTO
  VALIDATE_ERRORS: {
    EMPTY_PAYLOAD: () => undefined,

    INVALID_EXAM_ID_EMPTY: (sessionId: string) => ({
      examId: "",
      sessionId,
      answers: [],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_EXAM_ID_UUID: (sessionId: string) => ({
      examId: "not-a-valid-uuid-string",
      sessionId,
      answers: [],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_SESSION_ID_EMPTY: (examId: string) => ({
      examId,
      sessionId: "",
      answers: [],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_SESSION_ID_UUID: (examId: string) => ({
      examId,
      sessionId: "not-a-valid-uuid-string",
      answers: [],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_TIME_SPENT: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [{ questionId: VALID_UUID_V4, answer: 1, timeSpent: 5 }],
      timeSpent: -5, // ❌ Lỗi số âm
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_TIME_REMAINING: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [{ questionId: VALID_UUID_V4, answer: 1, timeSpent: 5 }],
      timeSpent: 10,
      timeRemaining: -1, // ❌ Lỗi số âm
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_FINISHED_DATE: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [{ questionId: VALID_UUID_V4, answer: 1, timeSpent: 5 }],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: "chuoi-ngay-thang-tam-bay", // ❌ Lỗi parse Date
    }),

    ANSWERS_REQUIRED: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [], // ❌ Mảng trống rỗng
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    ANSWER_FORMAT_INVALID: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [
        {
          questionId: VALID_UUID_V4,
          answer: "chuoi-thay-vi-so" as string,
          timeSpent: 5,
        },
      ], // ❌ Sai kiểu số
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    ANSWER_QUESTION_NOT_UUID: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      answers: [{ questionId: "not-a-valid-uuid-v4", answer: 1, timeSpent: 5 }], // ❌ questionId không phải UUID v4
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_ANSWER_VALUE_ZERO: (
      examId: string,
      sessionId: string,
      questionId: string,
    ) => ({
      examId,
      sessionId,
      answers: [{ questionId, answer: 0, timeSpent: 5 }], // ❌ answer <= 0
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    INVALID_ANSWER_VALUE_FLOAT: (
      examId: string,
      sessionId: string,
      questionId: string,
    ) => ({
      examId,
      sessionId,
      answers: [{ questionId, answer: 1.5, timeSpent: 5 }], // ❌ Không phải số nguyên
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),

    DUPLICATE_QUESTION: (
      examId: string,
      sessionId: string,
      questionId: string,
    ) => ({
      examId,
      sessionId,
      answers: [
        { questionId, answer: 1, timeSpent: 5 },
        { questionId, answer: 2, timeSpent: 5 }, // ❌ Gửi trùng lặp cùng 1 câu hỏi
      ],
      timeSpent: 10,
      timeRemaining: 10,
      clientFinishedAt: new Date().toISOString(),
    }),
  },
};
