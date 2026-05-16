// tests/integration/payloads/active-session.payload.ts

export const ACTIVE_SESSION_PAYLOAD = {
  START: {
    VALID: (examId: string, isForce: boolean = false) => ({
      examId,
      isForce,
    }),
    INVALID_EXAM_TYPE: () => ({
      examId: 12345, // Ép sai kiểu dữ liệu để test Validator chặn 400
      isForce: false,
    }),
    EMPTY: () => ({}),
  },

  SYNC: {
    VALID: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      currentQuestionIndex: 5,
      answers: { q1: 2, q2: null, q3: 1 },
      clientTimestamp: new Date().toISOString(),
    }),
    MISSING_SESSION_ID: (examId: string) => ({
      examId,
      currentQuestionIndex: 5,
      answers: { q1: 2 },
      clientTimestamp: new Date().toISOString(),
    }),
    NEGATIVE_INDEX: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      currentQuestionIndex: -1,
      answers: { q1: 2 },
      clientTimestamp: new Date().toISOString(),
    }),
    FAKE_SESSION: (examId: string, fakeSessionId: string) => ({
      examId,
      sessionId: fakeSessionId,
      currentQuestionIndex: 1,
      answers: {},
      clientTimestamp: new Date().toISOString(),
    }),
    MISSING_EXAM_ID: (sessionId: string) => ({
      sessionId,
      currentQuestionIndex: 5,
      answers: { q1: 2 },
      clientTimestamp: new Date().toISOString(),
    }),

    INVALID_ANSWERS_FORMAT: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      currentQuestionIndex: 5,
      answers: "[1, 2, 3]", 
      clientTimestamp: new Date().toISOString(),
    }),

    MISSING_TIMESTAMP: (examId: string, sessionId: string) => ({
      examId,
      sessionId,
      currentQuestionIndex: 5,
      answers: { q1: 2 },
    }),
  },
};
