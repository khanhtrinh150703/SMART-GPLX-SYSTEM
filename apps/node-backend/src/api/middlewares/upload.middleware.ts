import { AppError } from '@/shared/errors';
import { ErrorCode } from '@/shared/errors/error-codes';
import multer from 'multer';

/**
 * Cấu hình Multer lưu trữ vào RAM (Memory Storage)
 * Điều này bắt buộc để FileStorageService có thể đọc được file.buffer
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Chỉ chấp nhận các định dạng ảnh phổ biến
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR));
    }
  },
});