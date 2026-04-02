// user-test.config.ts

/**
 * CONFIGURATION CHUNG CHO INTEGRATION TESTS
 * File này chứa các config, endpoint, test data dùng chung cho User, Auth và License.
 */

export const API_BASE = {
  AUTH: '/api/v1/auth',
  USER: '/api/v1/users',
  LICENSE: '/api/v1/license-categories', // Tên đồng bộ
  CHAPTER: '/api/v1/chapters',
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

// ==================== OTHER TEST CONSTANTS ====================
export const TEST_EMAIL = 'gplx@dividesk.com';
export const NEW_PASSWORD = 'NewSecurePassword123@';

// ==================== REDIS HELPERS KEYS ====================
export const REDIS_KEYS = {
  getOtpKey: (email: string) => `otp:${email.toLowerCase()}`,
  getResendLockKey: (email: string) => `otp_lock:${email}`,
  getPendingUserKey: (email: string) => `pending_user:${email}`,
} as const;

// ==================== RE-EXPORT SHARED CONSTANTS ====================
// Đảm bảo các export này khớp với cấu trúc thư mục lỗi của cậu
export { ErrorCode, ErrorStatus } from '@/shared/errors';
export { Message } from '@/shared/errors/messages/success-messages-vn';