import { STORAGE_CONFIG } from "../config/storage.config";

/**
 * Hàm định dạng đường dẫn đầy đủ cho ảnh
 */
export const formatImageUrl = (pathFromDb: string | null | undefined): string | null => {
  if (!pathFromDb) return null;

  const baseUrl = process.env.APP_URL || '';
  const staticPrefix = STORAGE_CONFIG.STATIC_PREFIX || 'uploads';

  // Loại bỏ dấu gạch chéo '/' ở cuối baseUrl nếu có
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

  // Loại bỏ dấu gạch chéo '/' ở đầu đường dẫn ảnh nếu có
  const cleanPath = pathFromDb.replace(/^\/+/, '');

  // Kết quả: http://localhost:5000/uploads/questions/abc.jpg
  return `${cleanBaseUrl}/${staticPrefix}/${cleanPath}`;
};