// user-test.config.ts
import { API_CONSTANTS } from '@/domain/constants/api.constant';
import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';

/** CONFIG CHUNG CHO INTEGRATION TESTS */

export const API_BASE = {
  AUTH: '/api/v1/auth',
  USER: '/api/v1/users',
  LICENSE: '/api/v1/license-categories',
  CHAPTER: '/api/v1/chapters',
  QUESTION: '/api/v1/questions',
} as const;

// ==================== ENDPOINTS ====================

export const AUTH_ENDPOINTS = {
  REGISTER_INIT: `${API_BASE.AUTH}/register/init`,
  REGISTER_VERIFY: `${API_BASE.AUTH}/register/verify`,
  LOGIN: `${API_BASE.AUTH}/login`,
  LOGOUT: `${API_BASE.AUTH}/logout`,
  RESEND_OTP: `${API_BASE.AUTH}/resend-otp`,
  FORGOT_PASSWORD: `${API_BASE.AUTH}/forgot-password`,
  RESET_PASSWORD: `${API_BASE.AUTH}/reset-password`,
  REFRESH_TOKEN: `${API_BASE.AUTH}/refresh-token`,
} as const;

export const USER_ENDPOINTS = {
  ME_PROFILE: `${API_BASE.USER}/me/profile`,
  ME_PASSWORD: `${API_BASE.USER}/me/password`,
  USER_STATUS: (userId: string) => `${API_BASE.USER}/${userId}/status`,
  USER_DELETE: (userId: string) => `${API_BASE.USER}/${userId}`,
  USER_RESTORE: (userId: string) => `${API_BASE.USER}/${userId}/restore`,
  USERS_LIST: API_BASE.USER,
} as const;

export const LICENSE_ENDPOINTS = {
  BASE: API_BASE.LICENSE,
  CREATE: API_BASE.LICENSE,
  FETCH_ALL: API_BASE.LICENSE,
  UPDATE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  DELETE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  RESTORE: (id: string) => `${API_BASE.LICENSE}/${id}/restore`,
} as const;

export const CHAPTER_ENDPOINTS = {
  BASE: API_BASE.CHAPTER,
  CREATE: API_BASE.CHAPTER,
  FETCH_ALL: API_BASE.CHAPTER,
  UPDATE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  DELETE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  RESTORE: (id: string) => `${API_BASE.CHAPTER}/${id}/restore`,
} as const;

export const QUESTION_ENDPOINTS = {
  BASE: API_BASE.QUESTION,
  BY_ID: (id: string) => `${API_BASE.QUESTION}/${id}`,
  RESTORE: (id: string) => `${API_BASE.QUESTION}/${id}/restore`,
} as const;

export const EXAM_MATRIX_ENDPOINTS = {
  BASE: `${API_CONSTANTS.API_BASE}/exam-matrices`,
  CREATE: `${API_CONSTANTS.API_BASE}/exam-matrices`,
  GET_BY_ID: (id: string) => `${API_CONSTANTS.API_BASE}/exam-matrices/${id}`,
  UPDATE: (id: string) => `${API_CONSTANTS.API_BASE}/exam-matrices/${id}`,
  DELETE: (id: string) => `${API_CONSTANTS.API_BASE}/exam-matrices/${id}`,
  RESTORE: (id: string) => `${API_CONSTANTS.API_BASE}/exam-matrices/${id}/restore`,
} as const;

// ==================== TEST ACCOUNTS ====================

export const TEST_ACCOUNT = {
  username: 'trinh_cau_vang',
  email: 'gplx@dividesk.com',
  fullName: 'Trinh Cậu Vàng',
  password: 'Password123!',
  newPassword: 'NewSecurePassword123@',
  newPassword_2: 'NewSecurePassword123@z',
  confirmPassword: 'Password123!',
  wrongPassword: 'WrongPassword123!',
} as const;

export const ADMIN_ACCOUNT = {
  username: 'admin',
  password: 'AdminPassword123@',
};

export const NORMAL_ACCOUNT = {
  username: 'testuser',
  password: 'UserPassword123@',
};

// // ==================== OTHER TEST CONSTANTS ====================
// export const TEST_EMAIL = 'gplx@dividesk.com';
// export const NEW_PASSWORD = 'NewSecurePassword123@';

// ==================== TEST DATA ====================

export const TEST_UPDATE_DATA = {
  fullName: 'Trinh Cậu Vàng V2',
  urlPicture: 'https://cdn.smart-gplx.com/avatar.png',
} as const;

export const INVALID_TEST_DATA = {
  invalidEmail: 'not-an-email',
  weakPassword: '123',
} as const;

export const CHAPTER_PAYLOAD = {
  CREATE_VALID: {
    name: 'Quy định chung và quy tắc giao thông đường bộ',
    code: 'GPLX_CH1',
    description: 'Chương I bao gồm 180 câu hỏi cơ bản.',
    orderIndex: 1,
  },
  UPDATE_VALID: {
    name: 'Chương 1: Quy tắc GTĐB (Updated)',
    code: 'GPLX_CH1_V2',
    orderIndex: 99,
  },
  DUPLICATE_NAME: { name: 'Quy định chung và quy tắc giao thông đường bộ', code: 'NEW_CODE_999', orderIndex: 2 },
  DUPLICATE_CODE: { name: 'Tên chương hoàn toàn mới', code: 'GPLX_CH1', orderIndex: 3 },
  INVALID_ORDER: { name: 'Chương lỗi thứ tự', code: 'ORDER_ERR', orderIndex: -1 },
  INVALID_DESCRIPTION: { name: 'Chương có mô tả rỗng', code: 'CH_DESC_ERR', description: '   ', orderIndex: 1 },
} as const;

export const EXAM_MATRIX_PAYLOAD = {
  CREATE_VALID: (
    licenseCategoryId: string,
    chapterId: string,
    chapterIdSecond: string,
    chapterIdThird: string
  ) => ({
    licenseCategoryId,
    name: `Ma trận đề thi lý thuyết ${new Date().getFullYear()}`,
    description: 'Ma trận đề thi theo cấu trúc chuẩn cho hạng bằng lái xe',
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [
      { chapterId, percentage: 40, numberOfQuestions: 12 },
      { chapterId: chapterIdSecond, percentage: 35, numberOfQuestions: 11 },
      { chapterId: chapterIdThird, percentage: 25, numberOfQuestions: 7 },
    ],
  }),

  CREATE_INVALID_PERCENTAGE: (licenseCategoryId: string, chapterId: string, chapterIdSecond: string) => ({
    licenseCategoryId,
    name: 'Ma trận sai tổng phần trăm',
    description: 'Tổng phần trăm không bằng 100%',
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [
      { chapterId, percentage: 50, numberOfQuestions: 15 },
      { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 9 },
    ],
  }),

  CREATE_DUPLICATE_CHAPTER: (licenseCategoryId: string, chapterId: string) => ({
    licenseCategoryId,
    name: 'Ma trận bị trùng chương',
    description: 'Test case chương bị lặp',
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [
      { chapterId, percentage: 40, numberOfQuestions: 12 },
      { chapterId, percentage: 60, numberOfQuestions: 18 },
    ],
  }),

  CREATE_NO_DETAILS: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: 'Ma trận không có chương nào',
    description: 'Test case ma trận thiếu details',
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [],
  }),

  UPDATE_VALID: (
    chapterId: string,
    chapterIdSecond: string,
    chapterIdThird: string
  ) => ({
    name: 'Ma trận đề thi đã được cập nhật',
    description: 'Phiên bản cập nhật năm 2026',
    totalQuestions: 35,
    passingScore: 28,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [
      { chapterId, percentage: 45, numberOfQuestions: 16 },
      { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 10 },
      { chapterId: chapterIdThird, percentage: 25, numberOfQuestions: 9 },
    ],
  }),

  UPDATE_INVALID_PERCENTAGE: (chapterId: string, chapterIdSecond: string) => ({
    name: 'Ma trận cập nhật sai tổng %',
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    details: [
      { chapterId, percentage: 60, numberOfQuestions: 18 },
      { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 9 },
    ],
  }),
} as const;

export const QUESTION_DATA = {
  NORMAL_PAYLOAD: {
    content: "Khái niệm 'Phương tiện giao thông cơ giới đường bộ' được hiểu thế nào là đúng?",
    imageUrl: 'https://example.com/images/question-1.png',
    isCritical: false,
    difficultyLevel: 1,
    answers: [
      { content: 'Gồm xe ô tô; máy kéo; rơ moóc...', isCorrect: true, imageUrl: null },
      { content: 'Gồm xe gắn máy, xe đạp...', isCorrect: false, imageUrl: null },
    ],
  },

  CRITICAL_PAYLOAD: {
    content: "[CÂU ĐIỂM LIỆT] Người điều khiển phương tiện tham gia giao thông trong cơ thể có chất ma túy có bị nghiêm cấm hay không?",
    imageUrl: null,
    isCritical: true,
    difficultyLevel: 2,
    answers: [
      { content: 'Bị nghiêm cấm', isCorrect: true },
      { content: 'Không bị nghiêm cấm', isCorrect: false },
    ],
  },

  INVALID_CONTENT_SHORT: {
    content: 'Ngắn quá',
    difficultyLevel: 1,
    answers: [
      { content: 'Đáp án A', isCorrect: true },
      { content: 'Đáp án B', isCorrect: false },
    ],
  },

  MISSING_LICENSE: {
    content: 'Nội dung câu hỏi này dài hơn 10 ký tự chắc chắn rồi.',
    licenseCategoryIds: [],
    difficultyLevel: 1,
    answers: [
      { content: 'Đáp án A', isCorrect: true },
      { content: 'Đáp án B', isCorrect: false },
    ],
  },

  INSUFFICIENT_ANSWERS: {
    content: 'Câu hỏi này chỉ có duy nhất một đáp án thôi nè.',
    difficultyLevel: 1,
    answers: [{ content: 'Chỉ có mình em', isCorrect: true }],
  },

  NO_CORRECT_ANSWER: {
    content: 'Câu hỏi này toàn đáp án sai, chọn kiểu gì bây giờ?',
    difficultyLevel: 1,
    answers: [
      { content: 'Sai bét', isCorrect: false },
      { content: 'Cũng sai luôn', isCorrect: false },
    ],
  },

  UPDATE_PAYLOAD: {
    content: '[UPDATED] Nội dung đã được chỉnh sửa bởi Admin',
    isCritical: false,
    difficultyLevel: 3,
    answers: [
      { content: 'Đáp án cũ được giữ lại', isCorrect: true, imageUrl: null },
      { content: 'Đáp án mới toanh vừa thêm vào', isCorrect: false, imageUrl: 'https://example.com/new-ans.png' },
    ],
  },
} as const;

// ==================== REDIS HELPERS ====================

export const REDIS_KEYS = {
  getOtpKey: (email: string) => `${REDIS_CONSTANTS.OTP_PREFIX}${email.toLowerCase()}`,
  getResendLockKey: (email: string) => `${REDIS_CONSTANTS.OTP_LOCK_PREFIX}${email}`,
  getPendingUserKey: (email: string) => `${REDIS_CONSTANTS.PENDING_USER_PREFIX}${email}`,
} as const;

// Re-export
export { ErrorCode, ErrorStatus } from '@/shared/errors';
export { Message } from '@/shared/errors/messages/success-messages-vn';