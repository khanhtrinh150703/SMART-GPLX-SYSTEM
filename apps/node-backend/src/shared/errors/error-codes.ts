/**
 * ErrorCode definition - Định nghĩa mã lỗi toàn hệ thống
 * Tổ chức theo dạng Domain-driven để dễ dàng quản lý và mở rộng.
 */
export const ErrorCode = {
    /** * --- SYSTEM & INFRASTRUCTURE (SYS) --- 
     * Lỗi liên quan đến hạ tầng, server và phản hồi chung.
     */
    SYSTEM: {
        SUCCESS: 'SYS_000',           // Thao tác thành công
        INTERNAL_ERROR: 'SYS_500',    // Lỗi logic server không xác định
        SERVICE_UNAVAILABLE: 'SYS_503', // Server bảo trì hoặc quá tải
        DATABASE_ERROR: 'SYS_504',    // Lỗi truy vấn cơ sở dữ liệu
    },

    /** * --- AUTHENTICATION & AUTHORIZATION (AUTH) --- 
     * Quản lý định danh, quyền hạn và trạng thái phiên làm việc.
     */
    AUTH: {
        UNAUTHORIZED: 'AUTH_401',     // Chưa đăng nhập / Token không hợp lệ
        FORBIDDEN: 'AUTH_403',        // Không có quyền truy cập (Role không đủ)
        TOKEN_EXPIRED: 'AUTH_402',    // Token hết hạn
        INVALID_CREDENTIALS: 'AUTH_001', // Sai tài khoản hoặc mật khẩu (Nên ở đây thay vì Validation)
    },

    /** * --- USER & BUSINESS LOGIC (USER) --- 
     * Các lỗi liên quan chặt chẽ đến nghiệp vụ người dùng.
     */
    USER: {
        NOT_FOUND: 'USER_404',        // Không tìm thấy người dùng
        ALREADY_EXISTS: 'USER_409',   // Email/SĐT đã được sử dụng
        ACCOUNT_LOCKED: 'USER_001',   // Tài khoản bị khóa do vi phạm
        NOT_ACTIVATED: 'USER_002',    // Tài khoản chưa kích hoạt (OTP)
        REGISTER_FAILED: 'USER_003', // Đăng ký không thành công
    },

    /** * --- DATA VALIDATION (VAL) --- 
     * Chỉ dùng cho việc kiểm tra định dạng dữ liệu (Schema Validation).
     */
    VALIDATION: {
        INVALID_EMAIL: 'VAL_101',     
        INVALID_PASSWORD: 'VAL_102',  
        CONFIRM_PASSWORD_MISMATCH: 'VAL_103',
        MISSING_FIELD: 'VAL_201',     
        INVALID_FORMAT: 'VAL_202',    
        TOO_MANY_REQUESTS: 'VAL_301'  
    }
} as const;

/**
 * Type helper để trích xuất các giá trị chuỗi từ ErrorCode
 */
export type ErrorCodeType = {
    [K in keyof typeof ErrorCode]: typeof ErrorCode[K][keyof typeof ErrorCode[K]]
}[keyof typeof ErrorCode];