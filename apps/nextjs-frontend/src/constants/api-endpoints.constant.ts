/**
 * 💡 TIP: Thường thì chúng ta chỉ để PATH ở đây. 
 * Base URL sẽ được cấu hình tập trung ở file axios-client để code linh hoạt hơn.
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register/init`,
    VERIFY_OTP: `/auth/register/verify`,
    RESEND_OTP: `/auth/resend-otp`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
  },

  USER: {
    GET_ALL: `/users`,
    UPDATE_PROFILE: `/users/me/profile`,
    CHANGE_PASSWORD: `/users/me/password`,
    // 💡 FIX: Sử dụng function để truyền ID động vào đúng chuẩn
    UPDATE_BY_ADMIN: (id: string) => `/users/${id}/admin`,
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
    BASE: '/exam-matrices',
    DETAILS: (id: string) => `/exam-matrices/${id}`,
    RESTORE: (id: string) => `/exam-matrices/${id}/restore`,
  },

  EXAM: {
    BASE: '/exams',
    GENERATION: "/exams/generate-auto",
  }
};