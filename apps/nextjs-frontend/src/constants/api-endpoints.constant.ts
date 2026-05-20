/**
 * 💡 TIP: Thường thì chúng ta chỉ để PATH ở đây.
 * Base URL sẽ được cấu hình tập trung ở file axios-client để code linh hoạt hơn.
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
    REGISTER: `/auth/register/init`,
    VERIFY_OTP: `/auth/register/verify`,
    RESEND_OTP: `/auth/resend-otp`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
    REFRESH_TOKEN: "/auth/refresh-token",
  },

  USER: {
    GET_ALL: `/users`,
    UPDATE_PROFILE: `/users/me/profile`,
    CHANGE_PASSWORD: `/users/me/password`,
    UPDATE_BY_ADMIN: (id: string) => `/users/${id}/admin`,
    CHANGE_STATUS: (id: string) => `/users/${id}/admin`,
    CREATE_USER_BY_ADMIN: `/users/admin`,
    DELETE: (id: string) => `/users/${id}`,
    RESTORE: (id: string) => `/users/${id}/restore`,
  },

  LICENSE: {
    BASE: "/license-categories",
    DETAIL: (id: string) => `/license-categories/${id}`,
    RESTORE: (id: string) => `/license-categories/${id}/restore`,
    SELECTION: "/license-categories/selection",
  },

  CHAPTER: {
    BASE: "/chapters",
    DETAIL: (id: string) => `/chapters/${id}`,
    RESTORE: (id: string) => `/chapters/${id}/restore`,
    SELECTION: "/chapters/selection",
  },

  QUESTION: {
    BASE: "/questions",
    SLECTION: "questions/selection-pool",
    DETAIL: (id: string) => `/questions/${id}`,
    RESTORE: (id: string) => `/questions/${id}/restore`,
  },

  ROLE: {
    SELECTION: "/roles/selection",
  },

  IMPORT: {
    INIT: "/import/init",
    UPLOADCHUNK: "/import/upload-chunk",
    COMPLETE: "/import/complete",
    STATUS: "/import/status",
  },

  EXAM_MATRICES: {
    BASE: "/exam-matrices",
    DETAILS: (id: string) => `/exam-matrices/${id}`,
    RESTORE: (id: string) => `/exam-matrices/${id}/restore`,
    SELECTION: "/exam-matrices/selection",
  },

  EXAM: {
    AUTO: "/exams/generate-auto",
    MANUAL: "/exams/manual",
    BASE: "/exams",
    DETAILS: (id: string) => `/exams/${id}`,
    USER_DETAILS: (id: string) => `/exams/detail/${id}`,
    RESTORE: (id: string) => `/exams/${id}/restore`,
    GENERATION: "/exams/generate-auto",
    LIST: "/exams/list",
    SUBMIT: "/exam-attempts/complete",
    GUEST_SUBMIT: "/exam-attempts/guest/complete",
  },

  /**
   * ACTIVE SESSION ENDPOINTS
   * (Định tuyến cho Dịch vụ Phiên làm bài)
   */
  ACTIVE_SESSION: {
    // 1. GUEST ROUTES (PUBLIC)
    GUEST_START: "/active-sessions/guest/start",

    // 2. PROTECTED ROUTES (PRIVATE)
    CURRENT: "/active-sessions/current",
    START: "/active-sessions/start",
    SYNC: "/active-sessions/sync",
  },

  HISTORY: {
    BASE: "/exam-histories",
    SUMMARY: "/exam-histories/summary",
    DETAILS: (id: string) => `/exam-histories/summary/${id}`,
  },
  STATS: {
    BASE: "/statistics/me",
  },
};
