import jwt, { SignOptions, JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { AppError, ErrorCode } from '@/shared/errors'; 

const JWT_SECRET = process.env.JWT_SECRET || 'chuoi_khoa_bi_mat_cua_ban';

export const generateAccessToken = (payload: object, expiresIn: string | number = '15m'): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Xác thực mã thông báo (Verify Token) sử dụng Promise & Callback
 * @param token Chuỗi token cần kiểm tra
 * @returns Promise chứa dữ liệu (payload) nếu thành công
 */
export const verifyToken = (token: string): Promise<string | JwtPayload> => {
  return new Promise((resolve, reject) => {
    // Truyền thêm callback function làm tham số thứ 3
    jwt.verify(token, JWT_SECRET, (error: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      
      // Nếu có lỗi do thư viện trả về
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new AppError(ErrorCode.AUTH.TOKEN_EXPIRED));
        } 
        if (error.name === 'JsonWebTokenError') {
          return reject(new AppError(ErrorCode.AUTH.UNAUTHORIZED));
        }
        
        return reject(new AppError(ErrorCode.AUTH.FORBIDDEN));
      }
      
      // Nếu hợp lệ, trả về payload (ép kiểu an toàn)
      resolve(decoded as string | JwtPayload);
    });
  });
};