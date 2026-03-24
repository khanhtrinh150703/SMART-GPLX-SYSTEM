import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@/shared/types/auth.types';
import { ErrorCode, AppError } from '@/shared/errors';

/**
 * Lớp cung cấp các phương thức xử lý JSON Web Token (JWT).
 * Tách biệt hoàn toàn logic của thư viện jsonwebtoken với các tầng khác.
 */
export class JwtService {
    /**
     * Tác dụng: Tạo một JWT token mới dựa trên payload cung cấp.
     * @param {TokenPayload} payload - Dữ liệu cần mã hóa vào token (ví dụ: userId, role).
     * @param {string | number} expiresIn - Thời gian sống của token (ví dụ: '1h', '7d', 3600).
     * @returns {string} - Chuỗi JWT token đã được ký (signed token).
     */
    public static generateToken(payload: TokenPayload, expiresIn: string | number): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return jwt.sign(
            payload as TokenPayload,
            secret,
            { expiresIn } as jwt.SignOptions
        );
    }

    /**
     * Tác dụng: Xác thực JWT token và giải mã để lấy payload. Chuyển đổi lỗi của thư viện sang AppError chuẩn.
     * @param {string} token - Chuỗi JWT token cần xác thực.
     * @returns {TokenPayload} - Dữ liệu payload đã được giải mã nếu token hợp lệ.
     * @throws {AppError} - Ném ra lỗi hệ thống nếu token hết hạn hoặc không hợp lệ.
     */
    public static verifyToken(token: string): TokenPayload {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        try {
            const decoded = jwt.verify(token, secret) as TokenPayload;
            return decoded;
        } catch (error: unknown) {
            // Bắt lỗi cụ thể của jsonwebtoken và map sang AppError để Global Middleware xử lý
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(ErrorCode.AUTH.TOKEN_EXPIRED);
            }
            throw new AppError(ErrorCode.AUTH.INVALID_REFRESH_TOKEN);
        }
    }
}