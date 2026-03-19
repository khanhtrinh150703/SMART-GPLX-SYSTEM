import { ErrorCode, ErrorCodeType } from '../error-codes';

/**
 * Vietnamese Error Messages
 * Danh sách thông báo lỗi bằng tiếng Việt.
 */
export const ErrorMessages: Record<ErrorCodeType, string> = {
    // --- SYSTEM ---
    [ErrorCode.SYSTEM.SUCCESS]: 'Thao tác thực hiện thành công',
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau',
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 'Hệ thống đang bảo trì, vui lòng quay lại sau',

    // --- AUTH ---
    [ErrorCode.AUTH.UNAUTHORIZED]: 'Vui lòng đăng nhập để thực hiện hành động này',
    [ErrorCode.AUTH.FORBIDDEN]: 'Bạn không có quyền truy cập vào tài nguyên này',
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',

    // --- USER ---
    [ErrorCode.USER.ALREADY_EXISTS]: 'Thông tin tài khoản hoặc email đã tồn tại trên hệ thống',
    [ErrorCode.USER.NOT_FOUND]: 'Không tìm thấy thông tin người dùng yêu cầu',
    [ErrorCode.USER.ACCOUNT_LOCKED]: 'Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên',

    // --- VALIDATION ---
    [ErrorCode.VALIDATION.INVALID_EMAIL]: 'Địa chỉ email không đúng định dạng (ví dụ: abc@gmail.com)',
    [ErrorCode.VALIDATION.INVALID_PASSWORD]: 'Mật khẩu phải từ 8-20 ký tự, bao gồm chữ cái và số',
    [ErrorCode.VALIDATION.INVALID_MAPPING_PASSWORD]: 'Mật khẩu phải khớp với nhau',
    [ErrorCode.VALIDATION.MISSING_FIELD]: 'Vui lòng điền đầy đủ các thông tin bắt buộc',
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 'Định dạng dữ liệu gửi lên không hợp lệ',
    [ErrorCode.VALIDATION.TOO_MANY_REQUESTS]: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau ít phút'
};