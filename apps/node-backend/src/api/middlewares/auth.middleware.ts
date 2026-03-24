import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, ErrorCode } from '@/shared/errors';

/**
 * Định nghĩa cấu trúc dữ liệu (Payload) được giấu bên trong JWT.
 * Đảm bảo Type Safety tuyệt đối khi giải mã.
 */
export interface JwtPayload {
  userId: string;
  role: string;
}

/**
 * Mở rộng (Augment) Interface Request mặc định của Express.
 * Việc này giúp TypeScript hiểu rằng 'req' bây giờ có thêm thuộc tính 'user',
 * tránh lỗi gạch đỏ "Property 'user' does not exist on type 'Request'".
 */
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

/**
 * Middleware xác thực người dùng thông qua JWT (JSON Web Token).
 * Yêu cầu Client gửi kèm header: Authorization: Bearer <token>
 * * @param {Request} req - Đối tượng Request của Express.
 * @param {Response} _res - Đối tượng Response (thêm '_' vì không thao tác trực tiếp).
 * @param {NextFunction} next - Hàm chuyển tiếp sang middleware/controller tiếp theo.
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // 1. Lấy chuỗi token từ Header
    const authHeader = req.headers.authorization;
    
    // Kiểm tra xem header có tồn tại và đúng định dạng 'Bearer ...' không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED); // Ném lỗi: Chưa xác thực
    }

    // Cắt lấy phần token thực sự (bỏ chữ 'Bearer ')
    const token = authHeader.split(' ')[1];

    // 2. Lấy khóa bí mật từ biến môi trường (Tuân thủ Rule 4: Bảo mật)
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      // Lỗi cấu hình hệ thống, ném lỗi 500
      throw new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR); 
    }

    // 3. Xác minh tính hợp lệ và giải mã token (Verify & Decode)
    // Nếu token hết hạn hoặc sai chữ ký, hàm này sẽ tự động quăng lỗi (throw error)
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // 4. Gắn thông tin người dùng vào Request để các Controller phía sau sử dụng
    req.user = decoded;

    // 5. Cho phép luồng đi tiếp vào Controller
    next();
    
  } catch (error) {
    // 6. Xử lý lỗi (Error Handling) và chuyển giao cho Global Error Middleware

    // Trường hợp 1: Lỗi do Token đã hết thời gian sống
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(ErrorCode.AUTH.TOKEN_EXPIRED));
    }
    
    // Trường hợp 2: Lỗi do Token bị sai lệch, cố tình chỉnh sửa (Sai chữ ký)
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(ErrorCode.AUTH.TOKEN_EXPIRED));
    }

    // Trường hợp 3: Là lỗi AppError do chúng ta tự chủ động throw ở phía trên
    if (error instanceof AppError) {
      return next(error);
    }

    // Trường hợp 4: Lỗi hệ thống không xác định
    return next(new AppError(ErrorCode.SYSTEM.INTERNAL_ERROR));
  }
};