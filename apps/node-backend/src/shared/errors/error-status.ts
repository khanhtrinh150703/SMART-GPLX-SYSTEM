import { ErrorCode, ErrorCodeType } from './error-codes';

/**
 * Mapping ErrorCode to HTTP Status Codes
 * Ánh xạ mã lỗi nội bộ sang mã trạng thái HTTP chuẩn.
 */
export const ErrorStatus: Record<ErrorCodeType, number> = {
    // --- SYSTEM ---
    [ErrorCode.SYSTEM.SUCCESS]: 200,             // OK
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 500,      // Internal Server Error
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 503, // Service Unavailable

    // --- AUTH ---
    [ErrorCode.AUTH.UNAUTHORIZED]: 401,          // Unauthorized
    [ErrorCode.AUTH.FORBIDDEN]: 403,             // Forbidden
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 401,         // Unauthorized (Token hết hạn thường trả về 401)

    // --- USER ---
    [ErrorCode.USER.ALREADY_EXISTS]: 409,        // Conflict
    [ErrorCode.USER.NOT_FOUND]: 404,             // Not Found
    [ErrorCode.USER.ACCOUNT_LOCKED]: 403,        // Forbidden (Tài khoản bị khóa)

    // --- VALIDATION ---
    [ErrorCode.VALIDATION.INVALID_EMAIL]: 400,    // Bad Request
    [ErrorCode.VALIDATION.INVALID_PASSWORD]: 400, // Bad Request
    [ErrorCode.VALIDATION.INVALID_MAPPING_PASSWORD]: 400, // Bad Request
    [ErrorCode.VALIDATION.MISSING_FIELD]: 400,    // Bad Request
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 400,   // Bad Request
    [ErrorCode.VALIDATION.TOO_MANY_REQUESTS]: 429 // Too Many Requests
};