import { ErrorCode, ErrorCodeType } from "./error-codes";

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
  [ErrorCode.SYSTEM.DUPLICATE_DATA]: 409, // Conflict
  [ErrorCode.SYSTEM.RESOURCE_NOT_FOUND]: 404, // Not Found
  [ErrorCode.SYSTEM.RELATION_FAILED]: 422, // Unprocessable Entity

  // --- AUTHENTICATION & AUTHORIZATION ---
  [ErrorCode.AUTH.UNAUTHORIZED]: 401, // Unauthorized
  [ErrorCode.AUTH.FORBIDDEN]: 403, // Forbidden
  [ErrorCode.AUTH.TOKEN_EXPIRED]: 401, // Unauthorized
  [ErrorCode.AUTH.INVALID_REFRESH_TOKEN]: 401, // Unauthorized
  [ErrorCode.AUTH.INVALID_CREDENTIALS]: 401, // Unauthorized
  [ErrorCode.AUTH.REFRESH_FAILED]: 400, // Bad Request
  [ErrorCode.AUTH.ACCOUNT_LOCKED]: 423, // Forbidden (Tài khoản bị khóa)
  [ErrorCode.AUTH.NOT_ACTIVATED]: 403, // Forbidden (Chưa kích hoạt)
  [ErrorCode.AUTH.OTP_INVALID]: 400, // Bad Request
  [ErrorCode.AUTH.OTP_EXPIRED]: 400, // Bad Request
  [ErrorCode.AUTH.REGISTRATION_EXPIRED]: 400, // Bad Request
  [ErrorCode.AUTH.MISSING_FIELDS]: 400, // Bad Request
  [ErrorCode.AUTH.INVALID_TOKEN]: 401, // Bad Request
  [ErrorCode.AUTH.ROLES_NOT_INITIALIZED]: 401, // Bad Request
  [ErrorCode.AUTH.USERNAME_REQUIRED]: 400,
  [ErrorCode.AUTH.PASSWORD_REQUIRED]: 400,
  [ErrorCode.AUTH.USERNAME_INVALID]: 400,
  [ErrorCode.AUTH.REFRESH_TOKEN_REQUIRED]: 400,
  [ErrorCode.AUTH.EMAIL_INVALID]: 400,
  [ErrorCode.AUTH.PASSWORD_TOO_WEAK]: 400,
  [ErrorCode.AUTH.PASSWORD_MISMATCH]: 400,
  [ErrorCode.AUTH.EMAIL_REQUIRED]: 400,
  [ErrorCode.AUTH.OTP_REQUIRED]: 400,
  [ErrorCode.AUTH.NEW_PASSWORD_REQUIRED]: 400,

  // --- USER & PROFILE ---
  [ErrorCode.USER.NOT_FOUND]: 404, // Not Found
  [ErrorCode.USER.EMAIL_EXISTS]: 409, // Conflict
  [ErrorCode.USER.USERNAME_EXISTS]: 409, // Conflict
  [ErrorCode.USER.PHONE_EXISTS]: 409, // Conflict
  [ErrorCode.USER.REGISTER_FAILED]: 400, // Bad Request
  [ErrorCode.USER.UPDATE_FAILED]: 400, // Bad Request
  [ErrorCode.USER.NAME_REQUIRED]: 400, // Tên bắt buộc
  [ErrorCode.USER.NAME_TOO_SHORT]: 400, // Tên quá ngắn
  [ErrorCode.USER.NAME_TOO_LONG]: 400, // Tên quá dài
  [ErrorCode.USER.NAME_INVALID]: 400, // Tên sai định dạng
  [ErrorCode.USER.STATUS_INVALID]: 400, // Trạng thái sai
  [ErrorCode.USER.ROLES_REQUIRED]: 400, // Thiếu vai trò
  [ErrorCode.USER.INVALID_ROLE_ID]: 400, // ID vai trò không hợp lệ
  [ErrorCode.USER.AVATAR_TOO_LARGE]: 400, // Ảnh quá nặng
  [ErrorCode.USER.AVATAR_INVALID_TYPE]: 400, // Sai định dạng ảnh
  [ErrorCode.USER.MISSING_UPDATE_FIELDS]: 400,
  [ErrorCode.USER.INVALID_ROLES_FORMAT]: 400,
  [ErrorCode.USER.OLD_PASSWORD_REQUIRED]: 400,
  [ErrorCode.USER.NEW_PASSWORD_REQUIRED]: 400,
  [ErrorCode.USER.PASSWORD_MUST_BE_DIFFERENT]: 400,
  [ErrorCode.USER.PASSWORD_TOO_WEAK]: 400,
  [ErrorCode.USER.STATUS_REQUIRED]: 400,

  // --- SMART-GPLX (EXAM) ---
  // --- Nhóm 1xx: Validation (Lỗi do dữ liệu Client gửi lên) ---
  [ErrorCode.EXAM.ID_REQUIRED]: 400,
  [ErrorCode.EXAM.IMAGE_INVALID]: 400, // Bad Request
  [ErrorCode.EXAM.ANSWERS_EMPTY]: 422, // Unprocessable Entity (Dữ liệu đúng format nhưng sai nghiệp vụ)
  [ErrorCode.EXAM.ANSWER_FORMAT_INVALID]: 422, // Unprocessable Entity
  [ErrorCode.EXAM.NAME_REQUIRED]: 400, // Bad Request
  [ErrorCode.EXAM.NAME_TOO_LONG]: 400, // Bad Request
  [ErrorCode.EXAM.INVALID_MATRIX_ID]: 400, // Bad Request
  [ErrorCode.EXAM.USER_ID_REQUIRED]: 400,
  [ErrorCode.EXAM.LICENSE_CATEGORY_REQUIRED]: 400,
  [ErrorCode.EXAM.QUESTIONS_EMPTY]: 400,
  [ErrorCode.EXAM.INVALID_DURATION]: 400,
  [ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH]: 400,
  [ErrorCode.EXAM.MIN_CRITICAL_INVALID]: 400,
  [ErrorCode.EXAM.INVALID_TIME_RANGE]: 400,
  [ErrorCode.EXAM.TOTAL_QUESTIONS_INVALID]: 400,

  // --- Nhóm 2xx: Business/Pool (Lỗi logic kho dữ liệu/ma trận) ---
  [ErrorCode.EXAM.INSUFFICIENT_POOL_QUESTIONS]: 400, // Bad Request (Yêu cầu vượt quá khả năng đáp ứng của kho)
  [ErrorCode.EXAM.INSUFFICIENT_CHAPTER_QUESTIONS]: 400, // Bad Request
  [ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS]: 400, // Bad Request
  [ErrorCode.EXAM.QUESTION_DATA_INVALID]: 500, // Internal Server Error (Dữ liệu DB lỗi là lỗi hệ thống)

  // --- Nhóm 4xx: State/Flow (Lỗi trạng thái bài thi) ---
  [ErrorCode.EXAM.NOT_FOUND]: 404, // Not Found
  [ErrorCode.EXAM.ALREADY_SUBMITTED]: 409, // Conflict (Xung đột trạng thái)
  [ErrorCode.EXAM.EXPIRED]: 410, // Gone (Tài nguyên không còn khả dụng)

  // --- Nhóm 5xx: Infrastructure/AI (Lỗi hệ thống/Bên thứ 3) ---
  [ErrorCode.EXAM.AI_PROCESSING_ERROR]: 500, // Internal Server Error

  // --- FILE & UPLOAD ---
  [ErrorCode.FILE.UPLOAD_FAILED]: 500, // Internal Server Error
  [ErrorCode.FILE.TOO_LARGE]: 413, // Payload Too Large
  [ErrorCode.FILE.INVALID_TYPE]: 415, // Unsupported Media Type
  [ErrorCode.FILE.NOT_FOUND]: 404, // Not Found

  // --- DATA VALIDATION ---
  // --- 0xx: General Required & Format ---
  [ErrorCode.VALIDATION.REQUIRED]: 400,
  [ErrorCode.VALIDATION.ID_REQUIRED]: 400,
  [ErrorCode.VALIDATION.NAME_REQUIRED]: 400,
  [ErrorCode.VALIDATION.DESCRIPTION_REQUIRED]: 400,
  [ErrorCode.VALIDATION.INVALID_FORMAT]: 400,
  [ErrorCode.VALIDATION.INVALID_LENGTH]: 400,
  [ErrorCode.VALIDATION.CODE_REQUIRED]: 400,
  [ErrorCode.VALIDATION.INVALID_NUMBER]: 400,
  [ErrorCode.VALIDATION.INVALID_INPUT]: 400,

  // --- 1xx: Identity & Contact ---
  [ErrorCode.VALIDATION.EMAIL_INVALID]: 400,
  [ErrorCode.VALIDATION.NAME_INVALID_LENGTH]: 400,
  [ErrorCode.VALIDATION.NAME_FORMAT_INVALID]: 400,
  [ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG]: 400,

  // --- 2xx: Security & Authentication ---
  [ErrorCode.VALIDATION.PASSWORD_INVALID]: 400,
  [ErrorCode.VALIDATION.PASSWORD_CONFIRM_MISMATCH]: 400,
  [ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT]: 400,
  [ErrorCode.VALIDATION.PASSWORD_TOO_SHORT]: 400,
  [ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED]: 400,
  [ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID]: 400,

  // --- 3xx: Specific Business Logic ---
  [ErrorCode.VALIDATION.AGE_MUST_BE_NUMBER]: 400,
  [ErrorCode.VALIDATION.AGE_INVALID]: 400,
  [ErrorCode.VALIDATION.INVALID_PERCENTAGE]: 400,

  // --- 4xx: Exam & Training (Cập nhật mới) ---
  [ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED]: 400,
  [ErrorCode.VALIDATION.EXAM_QUESTIONS_EMPTY]: 400,
  [ErrorCode.VALIDATION.INVALID_DURATION]: 400,
  [ErrorCode.VALIDATION.PASSING_SCORE_TOO_HIGH]: 400,
  [ErrorCode.VALIDATION.MATRIX_ID_REQUIRED]: 400,
  [ErrorCode.VALIDATION.USER_ID_REQUIRED]: 400,
  [ErrorCode.VALIDATION.MIN_CRITICAL_INVALID]: 400,
  [ErrorCode.VALIDATION.RESTORE_FAILED_DUPLICATE]: 400,

  // --- LICENSE ---
  [ErrorCode.LICENSE.ID_REQUIRED]: 400,
  [ErrorCode.LICENSE.ALREADY_EXISTS]: 409,
  [ErrorCode.LICENSE.NOT_FOUND]: 404,
  [ErrorCode.LICENSE.IS_IN_USE]: 403,
  [ErrorCode.LICENSE.NAME_ALREADY_EXISTS]: 409,
  [ErrorCode.LICENSE.NAME_REQUIRED]: 400,
  [ErrorCode.LICENSE.NAME_INVALID_LENGTH]: 400,
  [ErrorCode.LICENSE.NAME_FORMAT_INVALID]: 400,
  [ErrorCode.LICENSE.AGE_REQUIRED]: 400,
  [ErrorCode.LICENSE.AGE_INVALID]: 400,
  [ErrorCode.LICENSE.DESCRIPTION_REQUIRED]: 400,
  [ErrorCode.LICENSE.DESCRIPTION_TOO_LONG]: 400,
  [ErrorCode.LICENSE.INVALID_ORDER]: 400,

  // --- CHAPTER DOMAIN ---
  [ErrorCode.CHAPTER.NOT_FOUND]: 404, // Not Found
  [ErrorCode.CHAPTER.NAME_ALREADY_EXISTS]: 409, // Conflict
  [ErrorCode.CHAPTER.CODE_ALREADY_EXISTS]: 409, // Conflict
  [ErrorCode.CHAPTER.IS_IN_USE]: 403, // Forbidden (Ràng buộc dữ liệu)
  [ErrorCode.CHAPTER.CREATE_FAILED]: 400, // Bad Request
  [ErrorCode.CHAPTER.UPDATE_FAILED]: 400, // Bad Request
  [ErrorCode.CHAPTER.INVALID_ORDER]: 400, // Bad Request
  [ErrorCode.CHAPTER.INVALID_DESCRIPTION]: 400, // Bad Request
  [ErrorCode.CHAPTER.ID_REQUIRED]: 400,
  [ErrorCode.CHAPTER.NAME_REQUIRED]: 400,
  [ErrorCode.CHAPTER.CODE_REQUIRED]: 400,
  [ErrorCode.CHAPTER.DESCRIPTION_REQUIRED]: 400,
  [ErrorCode.CHAPTER.DESCRIPTION_TOO_LONG]: 400,

  // --- QUESTION ---
  [ErrorCode.QUESTION.INVALID_FORMAT]: 400,
  [ErrorCode.QUESTION.MULTIPLE_CORRECT_ANSWERS]: 400,
  [ErrorCode.QUESTION.ANSWER_CONTENT_REQUIRED]: 400,
  [ErrorCode.QUESTION.EXPLANATION_TOO_LONG]: 400,
  [ErrorCode.QUESTION.LICENSE_ID_INVALID]: 400,
  [ErrorCode.QUESTION.CHAPTER_REQUIRED]: 400,
  [ErrorCode.QUESTION.CONTENT_INVALID]: 400,
  [ErrorCode.QUESTION.LICENSE_REQUIRED]: 400,
  [ErrorCode.QUESTION.DELETE_CRITICAL_RESTRICTED]: 400,
  [ErrorCode.QUESTION.ANSWERS_INSUFFICIENT]: 400,
  [ErrorCode.QUESTION.CORRECT_ANSWER_MISSING]: 400,
  [ErrorCode.QUESTION.IMAGE_URL_INVALID]: 400,
  [ErrorCode.QUESTION.ANSWERS_SYNC_FAILED]: 400,
  [ErrorCode.QUESTION.DIFFICULTY_INVALID]: 400,
  [ErrorCode.QUESTION.INDEX_INVALID]: 400,
  [ErrorCode.QUESTION.ID_REQUIRED]: 400,
  [ErrorCode.QUESTION.IS_CRITICAL_INVALID]: 404,
  [ErrorCode.QUESTION.STATUS_INVALID]: 400,
  [ErrorCode.QUESTION.ALREADY_EXISTS]: 409,
  [ErrorCode.QUESTION.NOT_FOUND]: 404,

  // IMPORT
  [ErrorCode.IMPORT.JOB_NOT_FOUND]: 404, // Not Found
  [ErrorCode.IMPORT.JOB_INVALID_STATUS]: 400, // Bad Request
  [ErrorCode.IMPORT.INVALID_CHUNK_INDEX]: 400, // Bad Request
  [ErrorCode.IMPORT.EXTRACT_FAILED]: 400, // Bad Request
  [ErrorCode.IMPORT.FILE_MISSING]: 400, // Bad Request
  [ErrorCode.IMPORT.CHUNK_SIZE_EXCEEDED]: 400, // Bad Request
  [ErrorCode.IMPORT.SESSION_EXPIRED]: 410, // Gone (Tài nguyên không còn tồn tại do hết hạn)
  [ErrorCode.IMPORT.FILE_NAME_REQUIRED]: 400,
  [ErrorCode.IMPORT.INVALID_TOTAL_SIZE]: 400,
  [ErrorCode.IMPORT.INVALID_TOTAL_CHUNKS]: 400,
  [ErrorCode.IMPORT.JOB_ID_REQUIRED]: 400,

  // --- MATRIX ERRORS ---
  [ErrorCode.MATRIX.NAME_REQUIRED]: 400,
  [ErrorCode.MATRIX.NAME_TOO_LONG]: 400,
  [ErrorCode.MATRIX.NO_DETAILS]: 400,
  [ErrorCode.MATRIX.INVALID_PERCENTAGE]: 400,
  [ErrorCode.MATRIX.INVALID_DURATION]: 400,
  [ErrorCode.MATRIX.INVALID_PASSING_SCORE]: 400,
  [ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS]: 400,
  [ErrorCode.MATRIX.CHAPTER_ID_REQUIRED]: 400,
  [ErrorCode.MATRIX.DUPLICATE_CHAPTER]: 409,
  [ErrorCode.MATRIX.NOT_FOUND]: 404,
  [ErrorCode.MATRIX.RESTORE_FAILED_DUPLICATE]: 409,
  [ErrorCode.MATRIX.LICENSE_CATEGORY_REQUIRED]: 400,
  [ErrorCode.MATRIX.PASSING_SCORE_TOO_HIGH]: 400,
  [ErrorCode.MATRIX.MISSING_FIELDS]: 400,
  [ErrorCode.MATRIX.ID_REQUIRED]: 400,
  [ErrorCode.MATRIX.MIN_CRITICAL_INVALID]: 400,
  [ErrorCode.MATRIX.IS_DEFAULT_INVALID]: 400,

  [ErrorCode.EXCEL.WORKSHEET_NOT_FOUND]: 400, // Bad Request
  [ErrorCode.EXCEL.INVALID_FORMAT]: 400,
  [ErrorCode.EXCEL.EMPTY_FILE]: 400,

  [ErrorCode.PROCESS.ALREADY_COMPLETED]: 400,

  // --- Nhóm MEDIA ---
  [ErrorCode.MEDIA.SOURCE_REQUIRED]: 400, // Bad Request
  [ErrorCode.MEDIA.INVALID_TYPE]: 415, // Unsupported Media Type
  [ErrorCode.MEDIA.FILE_TOO_LARGE]: 413, // Payload Too Large
  [ErrorCode.MEDIA.UPLOAD_FAILED]: 500, // Internal Server Error

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

  // --- Nhóm CACHE (CSH) ---
  [ErrorCode.CACHE.NOT_INITIALIZED]: 500, // Lỗi máy chủ do chưa sẵn sàng dữ liệu
  [ErrorCode.CACHE.EMPTY_DATA]: 500, // Lỗi dữ liệu hệ thống trống
  [ErrorCode.CACHE.REFRESH_FAILED]: 500, // Lỗi khi đồng bộ dữ liệu DB - Cache
  [ErrorCode.CACHE.KEY_NOT_FOUND]: 404, // Không tìm thấy bản ghi trong Cache

  // === MONGODB ===
  [ErrorCode.MONGODB.CONNECTION_ERROR]: 500,
  [ErrorCode.MONGODB.NOT_INITIALIZED]: 500,
  [ErrorCode.MONGODB.TRANSACTION_FAILED]: 500,
  [ErrorCode.MONGODB.QUERY_TIMEOUT]: 504, // Gateway Timeout (hoặc 500)

  // --- SESSION COMPLETE VALIDATION ---
  [ErrorCode.SESSION.EXAM_ID_REQUIRED]: 400, // Bad Request
  [ErrorCode.SESSION.INVALID_EXAM_ID]: 400, // Bad Request
  [ErrorCode.SESSION.INVALID_QUESTION_ID]: 400, // Bad Request
  [ErrorCode.SESSION.ANSWER_FORMAT_INVALID]: 400, // Bad Request
  [ErrorCode.SESSION.ANSWERS_REQUIRED]: 400,
  [ErrorCode.SESSION.DUPLICATE_QUESTION]: 400,
  [ErrorCode.SESSION.INVALID_ANSWER_VALUE]: 400,
  [ErrorCode.SESSION.INVALID_QUESTION_INDEX]: 400,
  [ErrorCode.SESSION.CLIENT_TIMESTAMP_REQUIRED]: 400,
  [ErrorCode.SESSION.SESSION_ID_REQUIRED]: 400,
  [ErrorCode.SESSION.INVALID_TIME_SPENT]: 400,
  [ErrorCode.SESSION.INVALID_TIME_REMAINING]: 400,
  [ErrorCode.SESSION.INVALID_FINISHED_DATE]: 400,
  
  [ErrorCode.SESSION.NOT_FOUND]: 404, // Not Found
  [ErrorCode.SESSION.ALREADY_SUBMITTED]: 409, // Conflict
  [ErrorCode.SESSION.EXPIRED]: 410, // Gone (Hết hạn)
};
