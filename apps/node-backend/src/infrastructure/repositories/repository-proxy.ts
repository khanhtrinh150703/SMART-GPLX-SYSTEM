import { Prisma } from "@prisma/client";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Tự động bọc lỗi hệ thống của Prisma tại tầng Repository bằng Proxy.
 * Chuyển hóa toàn bộ lỗi sập DB hoặc lỗi định dạng (Malformed UUID) thành AppError tiêu chuẩn.
 * @template T - Kiểu của Repository gốc kế thừa từ object.
 */
export function autoWrapRepository<T extends object>(repository: T): T {
  return new Proxy(repository, {
    get(target, propKey, receiver) {
      const originalMethod = Reflect.get(target, propKey, receiver);

      if (typeof originalMethod === "function") {
        return (...args: unknown[]): unknown => {
          const result = originalMethod.apply(target, args);

          if (result instanceof Promise) {
            return result.catch((error: unknown) => {
              console.error(`[DB ERROR at ${String(propKey)}]:`, error);

              // 1. Bắt các lỗi có mã định danh cụ thể từ Prisma Engine
              if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002")
                  throw new AppError(ErrorCode.SYSTEM.DUPLICATE_DATA);
                if (error.code === "P2003")
                  throw new AppError(ErrorCode.SYSTEM.RELATION_FAILED);
                if (error.code === "P2025")
                  throw new AppError(ErrorCode.SYSTEM.RESOURCE_NOT_FOUND);

                // CHỐT CHẶN MỚI: Bắt lỗi Malformed UUID / Inconsistent field value từ Database
                if (error.code === "P2023") {
                  throw new AppError(
                    ErrorCode.SYSTEM.INVALID_INPUT,
                    "Mã định danh truyền vào sai quy chuẩn hệ thống.",
                  );
                }
              }

              // CHỐT CHẶN MỚI: Bắt lỗi Validation lỗi cấu trúc/kiểu dữ liệu tại lớp Client của Prisma
              if (error instanceof Prisma.PrismaClientValidationError) {
                throw new AppError(
                  ErrorCode.SYSTEM.INVALID_INPUT,
                  "Dữ liệu không tương thích với cấu trúc lưu trữ.",
                );
              }

              // 2. Nếu là lỗi AppError do hệ thống chủ động ném từ trước, giữ nguyên để đẩy lên tầng trên
              if (error instanceof AppError) throw error;

              // 3. Lỗi bất khả kháng khác của hệ thống mạng/DB
              throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);
            });
          }
          return result;
        };
      }
      return originalMethod;
    },
  });
}
