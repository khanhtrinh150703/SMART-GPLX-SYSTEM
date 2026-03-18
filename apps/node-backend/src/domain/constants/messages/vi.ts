import { ErrorCode } from '../error-codes';

export const VietnameseMessages: Record<ErrorCode, string> = {
    // --- GENERAL & SYSTEM ---
    /** Success messages */
    [ErrorCode.SUCCESS]: 'Thao tác thành công',
    /** General server failure */
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Lỗi máy chủ nội bộ',
    /** Generic system error */
    [ErrorCode.INTERNAL_ERROR]: 'Lỗi hệ thống, vui lòng thử lại sau',

    // --- AUTHENTICATION & SECURITY ---
    /** Permission and access issues */
    [ErrorCode.UNAUTHORIZED]: 'Bạn không có quyền thực hiện hành động này',
    /** Login failure */
    [ErrorCode.INVALID_CREDENTIALS]: 'Tài khoản hoặc mật khẩu không chính xác',
    /** Session timeout */
    [ErrorCode.SESSION_EXPIRED]: 'Phiên đăng nhập đã hết hạn',

    // --- USER DOMAIN ---
    /** Missing user records */
    [ErrorCode.USER_NOT_FOUND]: 'Không tìm thấy tài khoản',
    /** Conflict with existing email */
    [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email này đã tồn tại trên hệ thống',
    /** Conflict with existing user data */
    [ErrorCode.USER_ALREADY_EXISTS]: 'Tài khoản này đã được đăng ký',

    // --- REQUEST & VALIDATION ---
    /** Malformed or incorrect requests */
    [ErrorCode.BAD_REQUEST]: 'Yêu cầu không hợp lệ hoặc có lỗi trong quá trình xử lý',
    /** Data format or constraint issues */
    [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu đầu vào không hợp lệ'
};