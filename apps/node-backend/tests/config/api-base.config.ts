import { API_CONFIG } from '@/shared/config/api.config';

/**
 * @description Định nghĩa các đường dẫn gốc (Base Paths) cho từng Module.
 * Tự động kế thừa Prefix và Version từ API_CONFIG.
 */
export const API_BASE = {
  AUTH: `${API_CONFIG.BASE_URL}/auth`,
  USER: `${API_CONFIG.BASE_URL}/users`,
  LICENSE: `${API_CONFIG.BASE_URL}/license-categories`,
  CHAPTER: `${API_CONFIG.BASE_URL}/chapters`,
  QUESTION: `${API_CONFIG.BASE_URL}/questions`,
  EXAM_MATRIX: `${API_CONFIG.BASE_URL}/exam-matrices`,
  ROLE: `${API_CONFIG.BASE_URL}/roles`,
} as const;