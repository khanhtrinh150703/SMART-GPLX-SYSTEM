import { Prisma } from '@prisma/client';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * @description Tự động bọc lỗi mà vẫn giữ nguyên kiểu (Type-safe).
 * @template T - Kiểu của Repository gốc.
 */
export function autoWrapRepository<T extends object>(repository: T): T {
  return new Proxy(repository, {
    get(target, propKey, receiver) {
      const originalMethod = Reflect.get(target, propKey, receiver);

      if (typeof originalMethod === 'function') {
        return (...args: unknown[]): unknown => { // Args là mảng các giá trị chưa biết
          const result = originalMethod.apply(target, args);

          if (result instanceof Promise) {
            return result.catch((error: unknown) => { // Lỗi là unknown, không dùng any
              console.error(`[DB ERROR at ${String(propKey)}]:`, error);

              // Sử dụng Type Guard (instanceof) để thu hẹp kiểu
              if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') throw new AppError(ErrorCode.SYSTEM.DUPLICATE_DATA);
                if (error.code === 'P2003') throw new AppError(ErrorCode.SYSTEM.RELATION_FAILED);
                if (error.code === 'P2025') throw new AppError(ErrorCode.SYSTEM.RESOURCE_NOT_FOUND);
              }

              if (error instanceof AppError) throw error;
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