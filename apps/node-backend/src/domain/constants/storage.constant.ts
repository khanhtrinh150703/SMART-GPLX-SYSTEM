/**
 * @description Định danh các nhóm tài nguyên lưu trữ.
 * Dùng để phân loại thư mục vật lý.
 */
export const STORAGE_FOLDERS = {
  PROFILE: 'profiles',
  QUESTION: 'questions',
  ANSWER: 'answers',
  LICENSE_CATEGORY: 'license-categories',
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];