import { SIZE_CONFIG } from "@/shared/config/size.config";
import { AppError } from "@/shared/errors";
import { ErrorCode } from "@/shared/errors/error-codes";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

/**
 * 1. Cấu hình Multer lưu trữ vào RAM (Memory Storage)
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: SIZE_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
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
        if (req.body[field] && typeof req.body[field] === "string") {
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

/**
 * 3. Cấu hình Multer cho Import File lớn (Giới hạn 15MB)
 * (Dịch: Multer configuration for large import files - 15MB limit)
 */
export const uploadImport = multer({
  storage: multer.memoryStorage(), // Khuyên dùng tường minh memoryStorage
  limits: {
    fileSize: SIZE_CONFIG.MAX_IMPORT_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    // console.log(`>>> [MULTER_FILTER] Receiving file: ${file.originalname}, Mime: ${file.mimetype}`);

    const allowedMimeTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/octet-stream",
    ];

    const isImage = file.mimetype.startsWith("image/");
    const isAllowedType = allowedMimeTypes.includes(file.mimetype);

    if (isAllowedType || isImage) {
      cb(null, true);
    } else {
      // nhưng Senior khuyên nên check kỹ mimetype này.
      cb(
        new AppError(
          ErrorCode.IMPORT.EXTRACT_FAILED,
          `Định dạng ${file.mimetype} không được hỗ trợ.`,
        ),
      );
    }
  },
});
