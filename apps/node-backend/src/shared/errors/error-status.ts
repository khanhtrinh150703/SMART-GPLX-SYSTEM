import { ErrorCode, ErrorCodeType } from './error-codes';

/**
 * Mapping ErrorCode to HTTP Status Codes
 * Ánh xạ mã lỗi nội bộ sang mã trạng thái HTTP chuẩn.
 */
export const ErrorStatus: Record<ErrorCodeType, number> = {
    // --- SYSTEM & INFRASTRUCTURE ---
    [ErrorCode.SYSTEM.SUCCESS]: 200,             // OK
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 500,      // Internal Server Error
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 503, // Service Unavailable
    [ErrorCode.SYSTEM.DATABASE_ERROR]: 500,      // Internal Server Error (Lỗi DB là lỗi server)

    // --- AUTHENTICATION & AUTHORIZATION ---
    [ErrorCode.AUTH.UNAUTHORIZED]: 401,          // Unauthorized (Chưa đăng nhập)
    [ErrorCode.AUTH.FORBIDDEN]: 403,             // Forbidden (Không có quyền)
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 401,          // Unauthorized (Token hết hạn)
    [ErrorCode.AUTH.INVALID_CREDENTIALS]: 401,   // Unauthorized (Sai User/Pass - Đã chuyển từ Validation sang đây)

    // --- USER DOMAIN ---
    [ErrorCode.USER.REGISTER_FAILED]: 400,       // Bad Request
    [ErrorCode.USER.NOT_FOUND]: 404,             // Not Found
    [ErrorCode.USER.ALREADY_EXISTS]: 409,        // Conflict (Dữ liệu đã tồn tại, gây xung đột)
    [ErrorCode.USER.ACCOUNT_LOCKED]: 403,        // Forbidden (Bị cấm truy cập do bị khóa)
    [ErrorCode.USER.NOT_ACTIVATED]: 403,         // Forbidden (Cần kích hoạt trước khi dùng)

    // --- DATA VALIDATION ---
    [ErrorCode.VALIDATION.INVALID_EMAIL]: 400,             // Bad Request
    [ErrorCode.VALIDATION.INVALID_PASSWORD]: 400,          // Bad Request
    [ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH]: 400, // Bad Request
    [ErrorCode.VALIDATION.MISSING_FIELD]: 400,             // Bad Request
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 400,            // Bad Request
    [ErrorCode.VALIDATION.TOO_MANY_REQUESTS]: 429          // Too Many Requests
};