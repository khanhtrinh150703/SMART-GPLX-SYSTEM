import { Request, Response, NextFunction } from 'express';

/**
 * Định nghĩa kiểu dữ liệu tường minh cho một hàm Controller bất đồng bộ.
 * Không dùng 'any', thay vào đó dùng 'unknown' cho kiểu trả về của Promise 
 * để đảm bảo an toàn tuyệt đối.
 */
type AsyncControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Hàm bọc (Wrapper) dùng để tự động bắt lỗi (catch errors) cho các hàm Controller.
 * @param {AsyncControllerFunction} fn - Hàm Controller cần bọc.
 */
export const catchAsync = (fn: AsyncControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Chạy hàm gốc, nếu nó ném ra lỗi (reject) thì tự động gọi next(error)
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};