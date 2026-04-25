import { ErrorCode, ErrorCodeType } from './error-codes';

/**
 * Mapping ErrorCode to HTTP Status Codes
 * Ánh xạ mã lỗi nội bộ sang mã trạng thái HTTP chuẩn.
 */
export const ErrorStatus: Record<ErrorCodeType, number> = {
    // --- SYSTEM & INFRASTRUCTURE ---
    [ErrorCode.SYSTEM.SUCCESS]: 200,
    [ErrorCode.SYSTEM.INVALID_INPUT]: 400,
    [ErrorCode.SYSTEM.ALREADY_EXISTS]: 409,
    [ErrorCode.SYSTEM.FILE_SIZE_EXCEEDED]: 413,
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 500,
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 503,
    [ErrorCode.SYSTEM.DATABASE_ERROR]: 500,
    [ErrorCode.SYSTEM.TOO_MANY_REQUESTS]: 429,
    [ErrorCode.SYSTEM.REQUEST_TIMEOUT]: 408,
    [ErrorCode.SYSTEM.CONFIG_ERROR]: 500,
    [ErrorCode.SYSTEM.BAD_REQUEST]: 400,
    [ErrorCode.SYSTEM.DUPLICATE_DATA]: 409,     // Conflict
    [ErrorCode.SYSTEM.RESOURCE_NOT_FOUND]: 404, // Not Found
    [ErrorCode.SYSTEM.RELATION_FAILED]: 422,    // Unprocessable Entity

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
    // --- Nhóm 1xx: Validation (Lỗi do dữ liệu Client gửi lên) ---
    [ErrorCode.EXAM.IMAGE_INVALID]: 400,           // Bad Request
    [ErrorCode.EXAM.ANSWERS_EMPTY]: 422,           // Unprocessable Entity (Dữ liệu đúng format nhưng sai nghiệp vụ)
    [ErrorCode.EXAM.ANSWER_FORMAT_INVALID]: 422,   // Unprocessable Entity
    [ErrorCode.EXAM.NAME_REQUIRED]: 400,           // Bad Request
    [ErrorCode.EXAM.NAME_TOO_LONG]: 400,           // Bad Request
    [ErrorCode.EXAM.INVALID_MATRIX_ID]: 400,       // Bad Request

    // --- Nhóm 2xx: Business/Pool (Lỗi logic kho dữ liệu/ma trận) ---
    [ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS]: 400,     // Bad Request (Yêu cầu vượt quá khả năng đáp ứng của kho)
    [ErrorCode.EXAM.INSUFFICIENT_CHAPTER_QUESTIONS]: 400,  // Bad Request
    [ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS]: 400, // Bad Request
    [ErrorCode.EXAM.QUESTION_DATA_INVALID]: 500,           // Internal Server Error (Dữ liệu DB lỗi là lỗi hệ thống)

    // --- Nhóm 4xx: State/Flow (Lỗi trạng thái bài thi) ---
    [ErrorCode.EXAM.NOT_FOUND]: 404,               // Not Found
    [ErrorCode.EXAM.ALREADY_SUBMITTED]: 409,       // Conflict (Xung đột trạng thái)
    [ErrorCode.EXAM.EXPIRED]: 410,                 // Gone (Tài nguyên không còn khả dụng)

    // --- Nhóm 5xx: Infrastructure/AI (Lỗi hệ thống/Bên thứ 3) ---
    [ErrorCode.EXAM.AI_PROCESSING_ERROR]: 500,     // Internal Server Error


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

    // --- MATRIX ERRORS ---
    [ErrorCode.MATRIX.NAME_REQUIRED]: 400,
    [ErrorCode.MATRIX.NAME_TOO_LONG]: 400,
    [ErrorCode.MATRIX.NO_DETAILS]: 400,
    [ErrorCode.MATRIX.INVALID_PERCENTAGE]: 400,
    [ErrorCode.MATRIX.INVALID_PASSING_SCORE]: 400,
    [ErrorCode.MATRIX.DUPLICATE_CHAPTER]: 409,
    [ErrorCode.MATRIX.NOT_FOUND]: 404,
    [ErrorCode.MATRIX.RESTORE_FAILED_DUPLICATE]: 409,

    [ErrorCode.EXCEL.WORKSHEET_NOT_FOUND]: 400, // Bad Request
    [ErrorCode.EXCEL.INVALID_FORMAT]: 400,
    [ErrorCode.EXCEL.EMPTY_FILE]: 400,

    [ErrorCode.PROCESS.ALREADY_COMPLETED]: 400,


    // --- Nhóm MEDIA ---
    [ErrorCode.MEDIA.SOURCE_REQUIRED]: 400, // Bad Request
    [ErrorCode.MEDIA.INVALID_TYPE]: 415,    // Unsupported Media Type
    [ErrorCode.MEDIA.FILE_TOO_LARGE]: 413,  // Payload Too Large
    [ErrorCode.MEDIA.UPLOAD_FAILED]: 500,   // Internal Server Error

    [ErrorCode.EXAM_ATTEMPT.ID_REQUIRED]: 400,
    [ErrorCode.EXAM_ATTEMPT.NOT_FOUND]: 404,
    [ErrorCode.EXAM_ATTEMPT.ALREADY_SUBMITTED]: 400,
    [ErrorCode.EXAM_ATTEMPT.TIME_EXPIRED]: 400,
    [ErrorCode.EXAM_ATTEMPT.SCORE_INVALID]: 400,
    [ErrorCode.EXAM_ATTEMPT.RESULT_CONSISTENCY_ERROR]: 400,
    [ErrorCode.EXAM_ATTEMPT.NOT_IN_PROGRESS]: 400,
    [ErrorCode.EXAM_ATTEMPT.UNAUTHORIZED_ACCESS]: 403,

    [ErrorCode.ACTIVE_SESSION.NOT_FOUND]: 404,
    [ErrorCode.ACTIVE_SESSION.EXPIRED]: 401, // Unauthorized
    [ErrorCode.ACTIVE_SESSION.REVOKED]: 401,
    [ErrorCode.ACTIVE_SESSION.MAX_SESSIONS_REACHED]: 403, // Forbidden
    [ErrorCode.ACTIVE_SESSION.INVALID_TOKEN]: 401,
    [ErrorCode.ACTIVE_SESSION.DEVICE_MISMATCH]: 403,
    [ErrorCode.ACTIVE_SESSION.INVALID_EXPIRATION_TIME]: 400,
};