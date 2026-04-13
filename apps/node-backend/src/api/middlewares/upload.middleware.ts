import { AppError } from '@/shared/errors';
import { ErrorCode } from '@/shared/errors/error-codes';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

/**
 * 1. Cấu hình Multer lưu trữ vào RAM (Memory Storage)
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Có thể tùy chỉnh lỗi cụ thể cho file ở đây
      cb(new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR));
    }
  },
});

/**
 * 2. Middleware bổ trợ: Tự động Parse các trường JSON String từ FormData
 * Vì Multer đẩy mọi thứ vào req.body dưới dạng String, hàm này sẽ biến chúng 
 * về lại dạng Object/Array để DTO không bị lỗi ".some is not a function"
 */
export const parseMultipartData = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
      fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (error) {
            // Nếu không parse được thì giữ nguyên hoặc bỏ qua
            console.warn(`Không thể parse trường ${field}:`, error);
          }
        }
      });
    }
    next();
  };
};