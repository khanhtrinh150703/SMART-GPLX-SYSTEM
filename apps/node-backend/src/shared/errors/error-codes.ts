/**
 * ErrorCode definition - Định nghĩa mã lỗi toàn hệ thống
 * Đã tinh chỉnh: Sửa lỗi trùng 409, phân tách rõ ràng các Domain.
 */
export const ErrorCode = {
    /** * --- SYSTEM & INFRASTRUCTURE (SYS) --- 
     * Các lỗi tầng hạ tầng và phản hồi chung.
     */
    SYSTEM: {
        SUCCESS: 'SYS_000',             // Thao tác thành công
        INTERNAL_ERROR: 'SYS_500',      // Lỗi server không xác định
        SERVICE_UNAVAILABLE: 'SYS_503', // Bảo trì
        DATABASE_ERROR: 'SYS_504',      // Lỗi truy vấn DB
        TOO_MANY_REQUESTS: 'SYS_429',   // Spam / Rate limit
        REQUEST_TIMEOUT: 'SYS_408',     // Hết thời gian chờ
        CONFIG_ERROR: 'SYS_505',
    },

    /** * --- AUTHENTICATION & AUTHORIZATION (AUTH) --- 
     * Bảo mật, phiên làm việc và định danh.
     */
    AUTH: {
        UNAUTHORIZED: 'AUTH_401',          // Chưa đăng nhập / Token thiếu hoặc sai
        FORBIDDEN: 'AUTH_403',             // Không có quyền truy cập (Role không đủ)
        TOKEN_EXPIRED: 'AUTH_402',         // Access Token đã hết hạn
        ACCOUNT_LOCKED: 'AUTH_423',        // Tài khoản bị khóa (vi phạm chính sách)
        NOT_ACTIVATED: 'AUTH_405',         // Chưa Verify (Email/OTP)
        INVALID_CREDENTIALS: 'AUTH_001',   // Sai tài khoản / mật khẩu
        OTP_INVALID: 'AUTH_002',           // Mã OTP sai
        OTP_EXPIRED: 'AUTH_003',           // Mã OTP đã hết hạn
        REGISTRATION_EXPIRED: 'AUTH_004',  // Link hoặc phiên đăng ký đã hết hạn
        INVALID_REFRESH_TOKEN: 'AUTH_005', // Refresh token không hợp lệ (Đã đổi từ 001)
        REFRESH_FAILED: 'AUTH_006',     // Token refresh failed
        MISSING_FIELDS: 'AUTH_400',
        INVALID_TOKEN: 'AUTH_007', // Token không hợp lệ (Sai chữ ký, bị chỉnh sửa...)
        ROLES_NOT_INITIALIZED: 'AUTH_406',
    },

    /** * --- USER & PROFILE (USER) --- 
     * Nghiệp vụ liên quan đến tài khoản người dùng.
     */
    USER: {
        NOT_FOUND: 'USER_404',          // Không tìm thấy user
        EMAIL_EXISTS: 'USER_409',       // Email đã dùng
        USERNAME_EXISTS: 'USER_410',    // Username đã dùng
        PHONE_EXISTS: 'USER_411',       // SĐT đã dùng
        REGISTER_FAILED: 'USER_003',    // Đăng ký thất bại
        UPDATE_FAILED: 'USER_004',      // Cập nhật profile lỗi
    },

    /** * --- SMART-GPLX DOMAIN (EXAM) --- 
     * Lỗi đặc thù cho hệ thống thi bằng lái xe.
     */
    EXAM: {
        NOT_FOUND: 'EXAM_404',          // Đề thi không tồn tại
        ALREADY_SUBMITTED: 'EXAM_409',  // Bài thi đã nộp trước đó
        EXPIRED: 'EXAM_410',            // Hết giờ làm bài
        AI_PROCESSING_ERROR: 'EXAM_500',// Lỗi AI khi chấm điểm/nhận diện
        IMAGE_INVALID: 'EXAM_001',      // Ảnh chụp bằng lái/CMND không rõ nét
    },

    /** * --- RESOURCE & UPLOAD (FILE) --- 
     * Quản lý hình ảnh, tài liệu.
     */
    FILE: {
        UPLOAD_FAILED: 'FILE_500',      // Lỗi upload lên Cloud/Server
        TOO_LARGE: 'FILE_413',          // File quá nặng
        INVALID_TYPE: 'FILE_415',       // Sai định dạng (Cần .jpg, .png...)
    },

    /** * --- DATA VALIDATION (VAL) --- 
     * Kiểm tra format đầu vào (Dùng cho Class Validator).
     */
    VALIDATION: {
        ID_REQUIRED: 'VAL_000',
        INVALID_EMAIL: 'VAL_101',
        INVALID_PASSWORD: 'VAL_102',
        CONFIRM_PASSWORD_MISMATCH: 'VAL_103',
        MISSING_FIELD: 'VAL_201',
        INVALID_FORMAT: 'VAL_202',
        INVALID_LENGTH: 'VAL_203',
        PASSWORD_MUST_BE_DIFFERENT: "VAL_204",
        PASSWORD_DIFFERENT: "VAL_205",
        NAME_REQUIRED: 'VAL_001',
        NAME_INVALID_LENGTH: 'VAL_002',
        NAME_FORMAT_INVALID: 'VAL_003',
        DESCRIPTION_REQUIRED: 'VAL_004',
        DESCRIPTION_TOO_LONG: 'VAL_005',
        MIN_AGE_MUST_BE_NUMBER: 'VAL_006', // Đã thêm từ DTO trước
        MIN_AGE_INVALID: 'VAL_007',
        REFRESH_TOKEN_REQUIRED: 'VAL_008',
        REFRESH_TOKEN_INVALID_FORMAT: 'VAL_009',
    },

    LICENSE: {
        NAME_ALREADY_EXISTS: 'LIC_409',
        ALREADY_EXISTS: 'LIC_001',
        NOT_FOUND: 'LIC_002',
        IS_IN_USE: 'LIC_003',
    },

    CHAPTER: {
        NOT_FOUND: 'CHPT_404',               // Không tìm thấy chương
        ALREADY_EXISTS: 'CHPT_409',          // Trùng tên chương
        HAS_RELATED_QUESTIONS: 'CHPT_403',   // Vi phạm ràng buộc (có câu hỏi)
        CREATE_FAILED: 'CHPT_001',           // Lỗi khi tạo mới
        UPDATE_FAILED: 'CHPT_002',           // Lỗi khi cập nhật
        INVALID_ORDER: 'CHPT_003',           // Thứ tự hiển thị không hợp lệ
    },

    QUESTION: {
        NOT_FOUND: 'QST_404',             // Không tìm thấy câu hỏi
        CHAPTER_REQUIRED: 'QST_001',      // Thiếu ID chương
        CONTENT_INVALID: 'QST_002',       // Nội dung không hợp lệ (ngắn quá)
        LICENSE_REQUIRED: 'QST_003',      // Thiếu hạng bằng lái
        ANSWERS_INSUFFICIENT: 'QST_004',  // Thiếu số lượng đáp án (min 2)
        CORRECT_ANSWER_MISSING: 'QST_005',// Thiếu đáp án đúng
        IMAGE_URL_INVALID: 'QST_006',     // Link ảnh không hợp lệ
        ALREADY_EXISTS: 'QST_409',        // Câu hỏi đã tồn tại (trùng nội dung)
        CANNOT_DELETE_CRITICAL: 'QUESTION_CANNOT_DELETE_CRITICAL',
        ANSWERS_SYNC_ERROR: 'QUESTION_ANSWERS_SYNC_ERROR',
    },
} as const;

export type ErrorCodeType = {
    [K in keyof typeof ErrorCode]: typeof ErrorCode[K][keyof typeof ErrorCode[K]]
}[keyof typeof ErrorCode];