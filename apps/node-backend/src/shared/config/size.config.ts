/**
 * Cấu hình giới hạn dung lượng tệp tin hệ thống (Tính theo bytes)
 * Ưu tiên bốc từ .env, nếu trống thì tự động fallback về giá trị mặc định an toàn.
 */
export const SIZE_CONFIG = {
  // Dung lượng ảnh đại diện / hồ sơ (Mặc định: 5MB)
  MAX_FILE_SIZE: (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,

  // Dung lượng tệp tin import lớn (Mặc định: 15MB)
  MAX_IMPORT_FILE_SIZE: (Number(process.env.MAX_IMPORT_FILE_SIZE_MB) || 15) * 1024 * 1024,
};