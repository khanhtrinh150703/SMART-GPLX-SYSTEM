import { ErrorCode, ErrorCodeType } from './error-codes';

/**
 * Mapping ErrorCode to HTTP Status Codes
 * Ánh xạ mã lỗi nội bộ sang mã trạng thái HTTP chuẩn.
 */
export const ErrorStatus: Record<ErrorCodeType, number> = {
    // --- SYSTEM & INFRASTRUCTURE ---
    [ErrorCode.SYSTEM.SUCCESS]: 200,                // OK
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 500,         // Internal Server Error
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 503,    // Service Unavailable
    [ErrorCode.SYSTEM.DATABASE_ERROR]: 500,         // Internal Server Error
    [ErrorCode.SYSTEM.TOO_MANY_REQUESTS]: 429,      // Too Many Requests
    [ErrorCode.SYSTEM.REQUEST_TIMEOUT]: 408,        // Request Timeout
    [ErrorCode.SYSTEM.CONFIG_ERROR]: 500,        // Request Timeout
    [ErrorCode.SYSTEM.FILE_SIZE_EXCEEDED]: 400,        // Request Timeout


    // --- AUTHENTICATION & AUTHORIZATION ---
    [ErrorCode.AUTH.UNAUTHORIZED]: 401,             // Unauthorized
    [ErrorCode.AUTH.FORBIDDEN]: 403,                // Forbidden
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 401,             // Unauthorized
    [ErrorCode.AUTH.INVALID_REFRESH_TOKEN]: 401,             // Unauthorized
    [ErrorCode.AUTH.INVALID_CREDENTIALS]: 401,      // Unauthorized
    [ErrorCode.AUTH.REFRESH_FAILED]: 400,              // Bad Request
    [ErrorCode.AUTH.ACCOUNT_LOCKED]: 403,           // Forbidden (Tài khoản bị khóa)
    [ErrorCode.AUTH.NOT_ACTIVATED]: 403,            // Forbidden (Chưa kích hoạt)
    [ErrorCode.AUTH.OTP_INVALID]: 400,              // Bad Request
    [ErrorCode.AUTH.OTP_EXPIRED]: 400,              // Bad Request
    [ErrorCode.AUTH.REGISTRATION_EXPIRED]: 400,              // Bad Request
    [ErrorCode.AUTH.MISSING_FIELDS]: 400, // Bad Request
    [ErrorCode.AUTH.INVALID_TOKEN]: 401, // Bad Request
    [ErrorCode.AUTH.ROLES_NOT_INITIALIZED]: 401, // Bad Request


    // --- USER & PROFILE ---
    [ErrorCode.USER.NOT_FOUND]: 404,                // Not Found
    [ErrorCode.USER.EMAIL_EXISTS]: 409,             // Conflict
    [ErrorCode.USER.USERNAME_EXISTS]: 409,          // Conflict
    [ErrorCode.USER.PHONE_EXISTS]: 409,             // Conflict
    [ErrorCode.USER.REGISTER_FAILED]: 400,          // Bad Request
    [ErrorCode.USER.UPDATE_FAILED]: 400,            // Bad Request
    [ErrorCode.USER.NAME_REQUIRED]: 400,            // Tên bắt buộc
    [ErrorCode.USER.NAME_TOO_SHORT]: 400,           // Tên quá ngắn
    [ErrorCode.USER.NAME_TOO_LONG]: 400,            // Tên quá dài
    [ErrorCode.USER.NAME_INVALID]: 400,             // Tên sai định dạng
    [ErrorCode.USER.STATUS_INVALID]: 400,           // Trạng thái sai
    [ErrorCode.USER.ROLES_REQUIRED]: 400,           // Thiếu vai trò
    [ErrorCode.USER.INVALID_ROLE_ID]: 400,          // ID vai trò không hợp lệ
    [ErrorCode.USER.AVATAR_TOO_LARGE]: 400,         // Ảnh quá nặng
    [ErrorCode.USER.AVATAR_INVALID_TYPE]: 400,      // Sai định dạng ảnh

    // --- SMART-GPLX (EXAM & AI) ---
    [ErrorCode.EXAM.NOT_FOUND]: 404,                // Not Found
    [ErrorCode.EXAM.ALREADY_SUBMITTED]: 409,        // Conflict
    [ErrorCode.EXAM.EXPIRED]: 410,                  // Gone (Bài thi đã kết thúc)
    [ErrorCode.EXAM.AI_PROCESSING_ERROR]: 500,      // Internal Server Error
    [ErrorCode.EXAM.IMAGE_INVALID]: 400,            // Bad Request (Ảnh mờ/không đúng định dạng)

    // --- FILE & UPLOAD ---
    [ErrorCode.FILE.UPLOAD_FAILED]: 500,            // Internal Server Error
    [ErrorCode.FILE.TOO_LARGE]: 413,                // Payload Too Large
    [ErrorCode.FILE.INVALID_TYPE]: 415,             // Unsupported Media Type
    [ErrorCode.FILE.NOT_FOUND]: 404,             // Not Found

    // --- DATA VALIDATION ---
    // --- VALIDATION (Tất cả đều là 400 Bad Request) ---
    [ErrorCode.VALIDATION.REQUIRED]: 400,
    [ErrorCode.VALIDATION.ID_REQUIRED]: 400,
    [ErrorCode.VALIDATION.NAME_REQUIRED]: 400,
    [ErrorCode.VALIDATION.DESCRIPTION_REQUIRED]: 400,
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 400,
    [ErrorCode.VALIDATION.INVALID_LENGTH]: 400,

    [ErrorCode.VALIDATION.EMAIL_INVALID]: 400,
    [ErrorCode.VALIDATION.NAME_INVALID_LENGTH]: 400,
    [ErrorCode.VALIDATION.NAME_FORMAT_INVALID]: 400,
    [ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG]: 400,

    [ErrorCode.VALIDATION.PASSWORD_INVALID]: 400,
    [ErrorCode.VALIDATION.PASSWORD_CONFIRM_MISMATCH]: 400,
    [ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT]: 400,
    [ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED]: 400,
    [ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID]: 400,

    [ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER]: 400,
    [ErrorCode.VALIDATION.AGE_INVALID]: 400,
    
    // --- LICENSE ---
    [ErrorCode.LICENSE.ALREADY_EXISTS]: 400,
    [ErrorCode.LICENSE.NOT_FOUND]: 404,
    [ErrorCode.LICENSE.IS_IN_USE]: 403,
    [ErrorCode.LICENSE.NAME_ALREADY_EXISTS]: 409,

    // --- CHAPTER DOMAIN ---
    [ErrorCode.CHAPTER.NOT_FOUND]: 404,              // Not Found
    [ErrorCode.CHAPTER.NAME_ALREADY_EXISTS]: 409,         // Conflict
    [ErrorCode.CHAPTER.CODE_ALREADY_EXISTS]: 409,         // Conflict
    [ErrorCode.CHAPTER.HAS_RELATED_QUESTIONS]: 403,  // Forbidden (Ràng buộc dữ liệu)
    [ErrorCode.CHAPTER.CREATE_FAILED]: 400,          // Bad Request
    [ErrorCode.CHAPTER.UPDATE_FAILED]: 400,          // Bad Request
    [ErrorCode.CHAPTER.INVALID_ORDER]: 400,          // Bad Request
    [ErrorCode.CHAPTER.INVALID_DESCRIPTION]: 400,          // Bad Request

    // --- QUESTION ---
    [ErrorCode.QUESTION.NOT_FOUND]: 404,
    [ErrorCode.QUESTION.CHAPTER_REQUIRED]: 400,
    [ErrorCode.QUESTION.CONTENT_INVALID]: 400,
    [ErrorCode.QUESTION.LICENSE_REQUIRED]: 400,
    [ErrorCode.QUESTION.CANNOT_DELETE_CRITICAL]: 400,
    [ErrorCode.QUESTION.ANSWERS_INSUFFICIENT]: 400,
    [ErrorCode.QUESTION.CORRECT_ANSWER_MISSING]: 400,
    [ErrorCode.QUESTION.IMAGE_URL_INVALID]: 400,
    [ErrorCode.QUESTION.ANSWERS_SYNC_ERROR]: 400,
    [ErrorCode.QUESTION.ALREADY_EXISTS]: 409,

    // IMPORT
    [ErrorCode.IMPORT.JOB_NOT_FOUND]: 404,        // Not Found
    [ErrorCode.IMPORT.JOB_INVALID_STATUS]: 400,   // Bad Request
    [ErrorCode.IMPORT.INVALID_CHUNK_INDEX]: 400,  // Bad Request
    [ErrorCode.IMPORT.EXTRACT_FAILED]: 400,  // Bad Request
    [ErrorCode.IMPORT.FILE_MISSING]: 400,  // Bad Request
    [ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED]: 400,  // Bad Request
    [ErrorCode.IMPORT.SESSION_EXPIRED]: 410, // Gone (Tài nguyên không còn tồn tại do hết hạn)
};