// user-test.config.ts

import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';

/**
 * CONFIGURATION CHUNG CHO INTEGRATION TESTS
 * File này chứa các config, endpoint, test data dùng chung cho User, Auth và License.
 */

export const API_BASE = {
  AUTH: '/api/v1/auth',
  USER: '/api/v1/users',
  LICENSE: '/api/v1/license-categories', // Tên đồng bộ
  CHAPTER: '/api/v1/chapters',
  QUESTION: '/api/v1/questions',
} as const;

// ==================== AUTH ENDPOINTS ====================
export const AUTH_ENDPOINTS = {
  REGISTER_INIT: `${API_BASE.AUTH}/register/init`,
  REGISTER_VERIFY: `${API_BASE.AUTH}/register/verify`,
  LOGIN: `${API_BASE.AUTH}/login`,
  LOGOUT: `${API_BASE.AUTH}/logout`,
  RESEND_OTP: `${API_BASE.AUTH}/resend-otp`,
  FORGOT_PASSWORD: `${API_BASE.AUTH}/forgot-password`,
  RESET_PASSWORD: `${API_BASE.AUTH}/reset-password`,
  REFRESH_TOKEN: `${API_BASE.AUTH}/refresh-token`
} as const;

// ==================== USER ENDPOINTS ====================
export const USER_ENDPOINTS = {
  ME_PROFILE: `${API_BASE.USER}/me/profile`,
  ME_PASSWORD: `${API_BASE.USER}/me/password`,
  USER_STATUS: (userId: string) => `${API_BASE.USER}/${userId}/status`,
  USER_DELETE: (userId: string) => `${API_BASE.USER}/${userId}`,
  USER_RESTORE: (userId: string) => `${API_BASE.USER}/${userId}/restore`,
  USERS_LIST: API_BASE.USER,
} as const;

// ==================== LICENSE ENDPOINTS ====================
export const LICENSE_ENDPOINTS = {
  BASE: API_BASE.LICENSE,
  CREATE: API_BASE.LICENSE,
  FETCH_ALL: API_BASE.LICENSE,
  // Dùng function để khi test gọi: LICENSE_ENDPOINTS.UPDATE(testCategoryId)
  UPDATE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  DELETE: (id: string) => `${API_BASE.LICENSE}/${id}`,
  RESTORE: (id: string) => `${API_BASE.LICENSE}/${id}/restore`,
} as const;

// ==================== CHAPTER ENDPOINTS ====================
// ==================== CHAPTER ENDPOINTS ====================
export const CHAPTER_ENDPOINTS = {
  BASE: API_BASE.CHAPTER,
  CREATE: API_BASE.CHAPTER,
  FETCH_ALL: API_BASE.CHAPTER,
  UPDATE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  DELETE: (id: string) => `${API_BASE.CHAPTER}/${id}`,
  RESTORE: (id: string) => `${API_BASE.CHAPTER}/${id}/restore`,
} as const;


// ==================== TEST ACCOUNT DATA ====================
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
  password: 'AdminPassword123@'
}

export const NORMAL_ACCOUNT = {
  username: 'testuser',
  password: 'UserPassword123@'
}
// ==================== TEST UPDATE DATA ====================
export const TEST_UPDATE_DATA = {
  fullName: 'Trinh Cậu Vàng V2',
  urlPicture: 'https://cdn.smart-gplx.com/avatar.png',
} as const;

// ==================== INVALID TEST DATA ====================
export const INVALID_TEST_DATA = {
  invalidEmail: 'not-an-email',
  weakPassword: '123',
} as const;

export const CHAPTER_PAYLOAD = {
  CREATE_VALID: {
    name: 'Quy định chung và quy tắc giao thông đường bộ',
    code: 'GPLX_CH1',
    description: 'Chương I bao gồm 180 câu hỏi cơ bản.',
    orderIndex: 1
  },
  UPDATE_VALID: {
    name: 'Chương 1: Quy tắc GTĐB (Updated)',
    code: 'GPLX_CH1_V2',
    orderIndex: 99
  },
  DUPLICATE_NAME: {
    name: 'Quy định chung và quy tắc giao thông đường bộ',
    code: 'NEW_CODE_999',
    orderIndex: 2
  },
  DUPLICATE_CODE: {
    name: 'Tên chương hoàn toàn mới',
    code: 'GPLX_CH1',
    orderIndex: 3
  },
  INVALID_ORDER: {
    name: 'Chương lỗi thứ tự',
    code: 'ORDER_ERR',
    orderIndex: -1
  },
  INVALID_DESCRIPTION: {
    name: 'Chương có mô tả rỗng',
    code: 'CH_DESC_ERR',
    description: '   ', // Chỉ chứa khoảng trắng
    orderIndex: 1
  }
};

// ==================== QUESTION ENDPOINTS ====================
export const QUESTION_ENDPOINTS = {
  BASE: `${API_BASE.QUESTION}`,
  BY_ID: (id: string) => `${API_BASE.QUESTION}/${id}`,
  RESTORE: (id: string) => `${API_BASE.QUESTION}/${id}/restore`,

  // Các URL tĩnh dùng cho Route setup
  ROUTE: {
    ROOT: '/',
    DETAIL: '/:id',
    RESTORE: '/:id/restore'
  }
} as const;

// ==================== OTHER TEST CONSTANTS ====================
export const TEST_EMAIL = 'gplx@dividesk.com';
export const NEW_PASSWORD = 'NewSecurePassword123@';

/**
 * @description Dữ liệu mẫu cho module Question (Ngân hàng câu hỏi)
 * Cậu Vàng lưu ý: chapterId và licenseCategoryIds sẽ được ghi đè (spread) trong file test
 * sau khi bốc được ID thực tế từ database.
 */
export const QUESTION_DATA = {
  // --- 1. DỮ LIỆU TẠO THÀNH CÔNG ---
  NORMAL_PAYLOAD: {
    content: "Khái niệm 'Phương tiện giao thông cơ giới đường bộ' được hiểu thế nào là đúng?",
    imageUrl: "https://example.com/images/question-1.png",
    isCritical: false,
    difficultyLevel: 1,
    answers: [
      { content: "Gồm xe ô tô; máy kéo; rơ moóc...", isCorrect: true, imageUrl: null },
      { content: "Gồm xe gắn máy, xe đạp...", isCorrect: false, imageUrl: null }
    ]
  },

  CRITICAL_PAYLOAD: {
    content: "[CÂU ĐIỂM LIỆT] Người điều khiển phương tiện tham gia giao thông trong cơ thể có chất ma túy có bị nghiêm cấm hay không?",
    imageUrl: null,
    isCritical: true,
    difficultyLevel: 2,
    answers: [
      { content: "Bị nghiêm cấm", isCorrect: true },
      { content: "Không bị nghiêm cấm", isCorrect: false }
    ]
  },

  // --- 2. DỮ LIỆU TEST VALIDATION LỖI ---
  INVALID_CONTENT_SHORT: {
    content: "Ngắn quá", // < 10 ký tự
    difficultyLevel: 1,
    answers: [
      { content: "Đáp án A", isCorrect: true },
      { content: "Đáp án B", isCorrect: false }
    ]
  },

  MISSING_LICENSE: {
    content: "Nội dung câu hỏi này dài hơn 10 ký tự chắc chắn rồi.",
    licenseCategoryIds: [], // Cố tình để mảng rỗng
    difficultyLevel: 1,
    answers: [
      { content: "Đáp án A", isCorrect: true },
      { content: "Đáp án B", isCorrect: false }
    ]
  },

  INSUFFICIENT_ANSWERS: {
    content: "Câu hỏi này chỉ có duy nhất một đáp án thôi nè.",
    difficultyLevel: 1,
    answers: [
      { content: "Chỉ có mình em", isCorrect: true } // Thiếu đáp án thứ 2
    ]
  },

  NO_CORRECT_ANSWER: {
    content: "Câu hỏi này toàn đáp án sai, chọn kiểu gì bây giờ?",
    difficultyLevel: 1,
    answers: [
      { content: "Sai bét", isCorrect: false },
      { content: "Cũng sai luôn", isCorrect: false } // Không có true
    ]
  },

  // --- 3. DỮ LIỆU CẬP NHẬT ---
  UPDATE_PAYLOAD: {
    content: "[UPDATED] Nội dung đã được chỉnh sửa bởi Admin",
    isCritical: false, // QUAN TRỌNG: Giữ false để test Xóa thành công ở bước sau
    difficultyLevel: 3,
    answers: [
      { content: "Đáp án cũ được giữ lại", isCorrect: true, imageUrl: null },
      { content: "Đáp án mới toanh vừa thêm vào", isCorrect: false, imageUrl: "https://example.com/new-ans.png" }
    ]
  }
};
// ==================== REDIS HELPERS KEYS ====================
export const REDIS_KEYS = {
  getOtpKey: (email: string) => `${REDIS_CONSTANTS.OTP_PREFIX}${email.toLowerCase()}`,
  getResendLockKey: (email: string) => `${REDIS_CONSTANTS.OTP_LOCK_PREFIX}${email}`,
  getPendingUserKey: (email: string) => `${REDIS_CONSTANTS.PENDING_USER_PREFIX}${email}`,
} as const;

// ==================== RE-EXPORT SHARED CONSTANTS ====================
// Đảm bảo các export này khớp với cấu trúc thư mục lỗi của cậu
export { ErrorCode, ErrorStatus } from '@/shared/errors';
export { Message } from '@/shared/errors/messages/success-messages-vn';