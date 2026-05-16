import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";
import { isUUID } from "@/shared/utils/uuid.util";

/**
 * @description Middleware gác cổng kiểm tra định dạng UUID của tham số trên URL (req.params)
 * @param paramNames Tên tham số (string) hoặc danh sách các tham số (string[]) cần check định dạng UUID
 */
export const validateUuidParam = (paramNames: string | string[] = "id") =>
  catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    // 💡 Đồng nhất mọi dữ liệu đầu vào về dạng mảng để xử lý Clean nhất
    const paramsToCheck = Array.isArray(paramNames) ? paramNames : [paramNames];

    for (const param of paramsToCheck) {
      const value = req.params[param];

      // 💡 Trường hợp 1: Không tìm thấy tham số trong Route 
      if (value === undefined) {
        throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
      }

      // 💡 Trường hợp 2: Tham số có tồn tại nhưng sai định dạng UUID (Lỗi do Client gõ bậy)
      if (!isUUID(value)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }
    }

    next();
  });
