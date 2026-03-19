/**
 * ErrorCode definition - Định nghĩa mã lỗi toàn hệ thống
 * Tổ chức theo dạng Domain-driven để dễ dàng quản lý và mở rộng.
 */
export const ErrorCode = {
    /** * --- SYSTEM & GENERAL --- 
     * Các mã lỗi liên quan đến hệ thống và phản hồi chung
     */
    SYSTEM: {
        SUCCESS: 'SUC_000',           // Thao tác thành công
        INTERNAL_ERROR: 'SYS_500',    // Lỗi hệ thống nội bộ
        SERVICE_UNAVAILABLE: 'SYS_503' // Dịch vụ tạm thời không khả dụng
    },

    /** * --- AUTHENTICATION --- 
     * Các lỗi liên quan đến định danh và quyền truy cập
     */
    AUTH: {
        UNAUTHORIZED: 'AUTH_401',     // Chưa đăng nhập hoặc token không hợp lệ
        FORBIDDEN: 'AUTH_403',        // Không có quyền truy cập tài nguyên
        TOKEN_EXPIRED: 'AUTH_402',    // Phiên đăng nhập đã hết hạn
    },

    /** * --- USER DOMAIN --- 
     * Các lỗi liên quan đến nghiệp vụ người dùng
     */
    USER: {
        ALREADY_EXISTS: 'USER_001',   // Tài khoản/Email đã tồn tại
        NOT_FOUND: 'USER_002',        // Không tìm thấy người dùng
        ACCOUNT_LOCKED: 'USER_003',   // Tài khoản đang bị khóa
    },

    /** * --- VALIDATION & REQUEST --- 
     * Kiểm tra dữ liệu đầu vào (DTO Validation)
     */
    VALIDATION: {
        // Yêu cầu của Trinh: Email và Mật khẩu
        INVALID_EMAIL: 'VAL_001',     // Email không đúng định dạng
        INVALID_PASSWORD: 'VAL_002',  // Mật khẩu không đúng quy định (độ dài, ký tự đặc biệt)
        INVALID_MAPPING_PASSWORD: 'VAL_003', // Mật khẩu không mapping với nhau
        
        // Các trường hợp phổ biến khác
        MISSING_FIELD: 'VAL_004',     // Thiếu trường thông tin bắt buộc
        INVALID_FORMAT: 'VAL_005',    // Định dạng dữ liệu không hợp lệ (ví dụ: ngày tháng, số điện thoại)
        TOO_MANY_REQUESTS: 'VAL_006'  // Gửi quá nhiều yêu cầu trong thời gian ngắn
    }
} as const;

/**
 * Type helper để trích xuất các giá trị chuỗi từ ErrorCode
 */
export type ErrorCodeType = {
  [K in keyof typeof ErrorCode]: typeof ErrorCode[K][keyof typeof ErrorCode[K]]
}[keyof typeof ErrorCode];