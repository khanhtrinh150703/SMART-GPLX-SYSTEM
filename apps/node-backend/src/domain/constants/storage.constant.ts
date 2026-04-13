/**
 * @description Định nghĩa các thư mục lưu trữ trong hệ thống
 */
export const STORAGE_FOLDERS = {
  PROFILE: 'profiles',
  QUESTION: 'questions',
  ANSWER: 'answers',
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];