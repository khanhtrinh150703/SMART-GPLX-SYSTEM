/**
 * ErrorCode definition - Định nghĩa mã lỗi toàn hệ thống
 * Đã tinh chỉnh: Sửa lỗi trùng 409, phân tách rõ ràng các Domain.
 */
export const ErrorCode = {
    /** * --- SYSTEM & INFRASTRUCTURE (SYS) --- 
     * Các lỗi tầng hạ tầng và phản hồi chung.
     */
    SYSTEM: {
        SUCCESS: 'SYS_000',
        FILE_SIZE_EXCEEDED: 'SYS_001',
        ALREADY_EXISTS: 'SYS_002',
        INVALID_INPUT: 'SYS_400',      // Lỗi validation (dữ liệu sai)
        BAD_REQUEST: 'SYS_401',        // Lỗi request không hợp lệ nói chung
        REQUEST_TIMEOUT: 'SYS_408',
        DUPLICATE_DATA: 'SYS_409',      // P2002: Trùng lặp dữ liệu (Unique constraint)
        RESOURCE_NOT_FOUND: 'SYS_444',  // P2025: Không tìm thấy bản ghi để thao tác
        RELATION_FAILED: 'SYS_422',     // P2003: Lỗi ràng buộc (Khóa ngoại không tồn tại)
        TOO_MANY_REQUESTS: 'SYS_429',
        INTERNAL_ERROR: 'SYS_500',
        SERVICE_UNAVAILABLE: 'SYS_503',
        DATABASE_ERROR: 'SYS_504',
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
        NAME_REQUIRED: 'USER_V001',     // Họ tên là bắt buộc
        NAME_TOO_SHORT: 'USER_V002',    // Họ tên quá ngắn (< 2 ký tự)
        NAME_TOO_LONG: 'USER_V003',     // Họ tên quá dài (> 100 ký tự)
        NAME_INVALID: 'USER_V004',      // Họ tên chứa ký tự không hợp lệ
        STATUS_INVALID: 'USER_V005',    // Trạng thái tài khoản không hợp lệ
        ROLES_REQUIRED: 'USER_V006',    // Phải gán ít nhất một vai trò
        INVALID_ROLE_ID: 'USER_V007',   // ID vai trò không tồn tại trong hệ thống
        AVATAR_TOO_LARGE: 'USER_V008',  // Kích thước ảnh quá lớn
        AVATAR_INVALID_TYPE: 'USER_V009' // Định dạng ảnh không hỗ trợ (chỉ jpg, png...)
    },

    /** * --- SMART-GPLX DOMAIN (EXAM) --- 
     * Lỗi đặc thù cho hệ thống thi bằng lái xe.
     */
    EXAM: {
        // --- Nhóm 1xx: Lỗi dữ liệu đầu vào (Validation) ---
        IMAGE_INVALID: 'EXM_101',           // Ảnh không hợp lệ
        ANSWERS_EMPTY: 'EXM_102',           // Danh sách câu trả lời trống
        ANSWER_FORMAT_INVALID: 'EXM_103',   // Định dạng câu trả lời sai
        NAME_REQUIRED: 'EXM_104',           // Tên không được để trống
        NAME_TOO_LONG: 'EXM_105',           // Tên quá dài
        INVALID_MATRIX_ID: 'EXM_106',       // Mã ma trận đề thi không hợp lệ

        // --- Nhóm 2xx: Lỗi nghiệp vụ & Kho dữ liệu (Pool & Business) ---
        INSUFFICIENT_POOL_QUESTIONS: 'EXM_201',     // Tổng kho không đủ câu hỏi
        INSUFFICIENT_CHAPTER_QUESTIONS: 'EXM_202',  // Thiếu câu hỏi theo chương mục
        INSUFFICIENT_CRITICAL_QUESTIONS: 'EXM_203', // Thiếu câu hỏi điểm liệt
        QUESTION_DATA_INVALID: 'EXM_204',           // Dữ liệu câu hỏi trong kho bị lỗi/thiếu

        // --- Nhóm 4xx: Lỗi trạng thái & Luồng thực thi (Flow & State) ---
        NOT_FOUND: 'EXM_404',               // Không tìm thấy bài thi (Dùng 404 cho dễ nhớ)
        ALREADY_SUBMITTED: 'EXM_409',       // Đã nộp bài trước đó (Dùng 409 - Conflict)
        EXPIRED: 'EXM_410',                 // Hết giờ làm bài (Dùng 410 - Gone)

        // --- Nhóm 5xx: Lỗi xử lý hạ tầng & AI (System/AI) ---
        AI_PROCESSING_ERROR: 'EXM_500',     // Lỗi xử lý AI (Giải thích đáp án...)
    },

    /** * --- RESOURCE & UPLOAD (FILE) --- 
     * Quản lý hình ảnh, tài liệu.
     */
    FILE: {
        UPLOAD_FAILED: 'FILE_500',      // Lỗi upload lên Cloud/Server
        TOO_LARGE: 'FILE_413',          // File quá nặng
        INVALID_TYPE: 'FILE_415',       // Sai định dạng (Cần .jpg, .png...)
        NOT_FOUND: 'FILE_404',          // Tệp tin không tồn tại (Dịch: File not found)
    },

    /** * --- DATA VALIDATION (VAL) --- 
     * Kiểm tra format đầu vào (Dùng cho Class Validator).
     */
    VALIDATION: {
        // --- 0xx: General Required & Format (Lỗi chung & Định dạng) ---
        REQUIRED: 'VAL_000',               // Trường bắt buộc chung (MISSING_FIELD)
        ID_REQUIRED: 'VAL_001',
        NAME_REQUIRED: 'VAL_002',
        DESCRIPTION_REQUIRED: 'VAL_003',
        INVALID_FORMAT: 'VAL_004',
        INVALID_LENGTH: 'VAL_005',

        // --- 1xx: Identity & Contact (Định danh & Liên lạc) ---
        EMAIL_INVALID: 'VAL_101',
        NAME_INVALID_LENGTH: 'VAL_102',
        NAME_FORMAT_INVALID: 'VAL_103',
        DESCRIPTION_TOO_LONG: 'VAL_104',

        // --- 2xx: Security & Authentication (Mật khẩu & Token) ---
        PASSWORD_INVALID: 'VAL_201',
        PASSWORD_CONFIRM_MISMATCH: 'VAL_202', // CONFIRM_PASSWORD_MISMATCH
        PASSWORD_MUST_BE_DIFFERENT: 'VAL_203', // Dùng cho đổi mật khẩu (mới khác cũ)
        REFRESH_TOKEN_REQUIRED: 'VAL_204',
        REFRESH_TOKEN_INVALID: 'VAL_205',

        // --- 3xx: Specific Business Logic (Logic nghiệp vụ cụ thể) ---
        AGE_MUST_BE_NUMBER: 'VAL_301',
        AGE_INVALID: 'VAL_302',
    },

    LICENSE: {
        NAME_ALREADY_EXISTS: 'LIC_409',
        ALREADY_EXISTS: 'LIC_001',
        NOT_FOUND: 'LIC_002',
        IS_IN_USE: 'LIC_003',
    },

    CHAPTER: {
        NOT_FOUND: 'CHPT_404',               // Không tìm thấy chương
        NAME_ALREADY_EXISTS: 'CHPT_409',     // Trùng TÊN chương (Đổi từ ALREADY_EXISTS)
        CODE_ALREADY_EXISTS: 'CHPT_410',     // Trùng MÃ chương (Thêm mới)
        HAS_RELATED_QUESTIONS: 'CHPT_403',   // Vi phạm ràng buộc (có câu hỏi)
        CREATE_FAILED: 'CHPT_001',           // Lỗi khi tạo mới
        UPDATE_FAILED: 'CHPT_002',           // Lỗi khi cập nhật
        INVALID_ORDER: 'CHPT_003',           // Thứ tự hiển thị không hợp lệ
        INVALID_DESCRIPTION: 'CHPT_004',
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

    IMPORT: {
        JOB_NOT_FOUND: 'IMP_001',        // IMPORT_JOB_NOT_FOUND
        JOB_INVALID_STATUS: 'IMP_002',   // IMPORT_JOB_INVALID_STATUS
        INVALID_CHUNK_INDEX: 'IMP_003',  // INVALID_CHUNK_INDEX
        EXTRACT_FAILED: 'IMP_004',       // EXTRACT_FAILED
        FILE_MISSING: 'IMP_005',         // FILE_MISSING
        CHUNK_SIZE_EXCEEDED: 'IMP_006',  // CHUNK_SIZE_EXCEEDED
        SESSION_EXPIRED: 'IMP_007',      // IMPORT_SESSION_EXPIRED
    },

    MATRIX: {
        // --- Nhóm 1xx: Validation (Lỗi nhập liệu) ---
        NAME_REQUIRED: 'MTX_101',           // Tên ma trận không được trống
        NAME_TOO_LONG: 'MTX_102',           // Tên ma trận quá dài
        NO_DETAILS: 'MTX_103',              // Ma trận không có chi tiết cấu trúc
        INVALID_PERCENTAGE: 'MTX_104',       // Tổng tỉ lệ phần trăm không bằng 100%
        INVALID_PASSING_SCORE: 'MTX_105',    // Điểm đạt không hợp lệ
        DUPLICATE_CHAPTER: 'MTX_106',        // Trùng lặp chương trong ma trận

        // --- Nhóm 4xx: State/Management (Lỗi trạng thái/Quản lý) ---
        NOT_FOUND: 'MTX_404',                // Không tìm thấy ma trận
        RESTORE_FAILED_DUPLICATE: 'MTX_409', // Khôi phục thất bại do trùng tên đã tồn tại
    },

    EXCEL: {
        WORKSHEET_NOT_FOUND: 'EXCEL_001',
        INVALID_FORMAT: 'EXCEL_002',
        EMPTY_FILE: 'EXCEL_003',
    },

    PROCESS: {
        ALREADY_COMPLETED: 'PRC_001', // Process Error 001
    },

    MEDIA: {
        // --- Nhóm 1xx: Validation (Lỗi dữ liệu đầu vào) ---
        SOURCE_REQUIRED: 'MED_101',     // Nguồn (path/url/buffer) không được để trống
        INVALID_TYPE: 'MED_102',        // Loại file không hỗ trợ
        FILE_TOO_LARGE: 'MED_103',      // File quá dung lượng
        UPLOAD_FAILED: 'MED_501',       // Lỗi khi upload lên Storage (S3, Cloudinary...)
    },

    EXAM_ATTEMPT: {
        ID_REQUIRED: 'EXA_000',
        NOT_FOUND: 'EXA_001',
        ALREADY_SUBMITTED: 'EXA_002',
        TIME_EXPIRED: 'EXA_003',
        SCORE_INVALID: 'EXA_004',
        RESULT_CONSISTENCY_ERROR: 'EXA_005',
        NOT_IN_PROGRESS: 'EXA_006',
        UNAUTHORIZED_ACCESS: 'EXA_007',
    },

    ACTIVE_SESSION: {
        NOT_FOUND: 'SES_001',
        EXPIRED: 'SES_002',
        REVOKED: 'SES_003',
        MAX_SESSIONS_REACHED: 'SES_004',
        INVALID_TOKEN: 'SES_005',
        DEVICE_MISMATCH: 'SES_006',
        INVALID_EXPIRATION_TIME: 'SES_007'
    }
} as const;

export type ErrorCodeType = {
    [K in keyof typeof ErrorCode]: typeof ErrorCode[K][keyof typeof ErrorCode[K]]
}[keyof typeof ErrorCode];