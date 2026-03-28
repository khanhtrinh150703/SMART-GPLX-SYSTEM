import { Request, Response, NextFunction } from 'express';

/**
 * Định nghĩa kiểu dữ liệu Generic cho một hàm Controller bất đồng bộ.
 * @template T - Kiểu của Request (mặc định là Request chuẩn của Express).
 */
type AsyncControllerFunction<T extends Request = Request> = (
  req: T, 
  res: Response, 
  next: NextFunction
) => Promise<unknown>;

/**
 * Hàm bọc (Wrapper) dùng để tự động bắt lỗi cho các hàm Controller.
 * Hỗ trợ đa dạng các kiểu Request (AuthRequest, Request, v.v.) thông qua Generics.
 * * @param {AsyncControllerFunction<T>} fn - Hàm Controller cần bọc.
 */
export const catchAsync = <T extends Request>(fn: AsyncControllerFunction<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ép kiểu 'req as T' một cách an toàn để TypeScript không báo lỗi khi truyền AuthRequest
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
};