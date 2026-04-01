import { ErrorCode, ErrorCodeType } from '../error-codes';

/**
 * Vietnamese Error Messages
 * Danh sách thông báo lỗi chi tiết, giúp người dùng dễ dàng hiểu vấn đề.
 */
export const ErrorMessages: Record<ErrorCodeType, string> = {
    // === SYSTEM & INFRASTRUCTURE (SYS) ===
    [ErrorCode.SYSTEM.SUCCESS]: 'Thao tác thực hiện thành công.',
    [ErrorCode.SYSTEM.INTERNAL_ERROR]: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.',
    [ErrorCode.SYSTEM.SERVICE_UNAVAILABLE]: 'Máy chủ đang bảo trì, vui lòng quay lại sau.',
    [ErrorCode.SYSTEM.DATABASE_ERROR]: 'Lỗi kết nối cơ sở dữ liệu, vui lòng thử lại.',
    [ErrorCode.SYSTEM.TOO_MANY_REQUESTS]: 'Bạn thao tác quá nhanh, vui lòng đợi một lát.',
    [ErrorCode.SYSTEM.REQUEST_TIMEOUT]: 'Yêu cầu xử lý quá thời gian quy định, vui lòng thử lại.',
    [ErrorCode.SYSTEM.CONFIG_ERROR]: "Hệ thống gặp sự cố về cấu hình kỹ thuật. Vui lòng liên hệ bộ phận kỹ thuật.",


    // === AUTHENTICATION & AUTHORIZATION (AUTH) ===
    [ErrorCode.AUTH.UNAUTHORIZED]: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.',
    [ErrorCode.AUTH.FORBIDDEN]: 'Bạn không có quyền thực hiện hành động này.',
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.',
    [ErrorCode.AUTH.INVALID_REFRESH_TOKEN]: 'Mã thông báo làm mới không hợp lệ.',
    [ErrorCode.AUTH.REFRESH_FAILED]: 'Cập nhật mã thông báo thất bại.',
    [ErrorCode.AUTH.INVALID_CREDENTIALS]: 'Tài khoản hoặc mật khẩu không chính xác.',
    [ErrorCode.AUTH.ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa do vi phạm chính sách hệ thống.',
    [ErrorCode.AUTH.NOT_ACTIVATED]: 'Tài khoản chưa được kích hoạt, vui lòng xác thực Email/OTP.',
    [ErrorCode.AUTH.OTP_INVALID]: 'Mã xác thực (OTP) không chính xác.',
    [ErrorCode.AUTH.OTP_EXPIRED]: 'Mã xác thực đã hết hiệu lực, vui lòng lấy mã mới.',
    [ErrorCode.AUTH.REGISTRATION_EXPIRED]: 'Liên kết đăng ký đã hết hạn hoặc không còn tồn tại, vui lòng thực hiện lại quy trình đăng ký.',
    [ErrorCode.AUTH.MISSING_FIELDS]: "Vui lòng nhập đầy đủ các thông tin bắt buộc.",
    [ErrorCode.AUTH.INVALID_TOKEN]: "Mã xác thực không hợp lệ",



    // === USER & PROFILE (USER) ===
    [ErrorCode.USER.NOT_FOUND]: 'Người dùng không tồn tại trên hệ thống.',
    [ErrorCode.USER.EMAIL_EXISTS]: 'Địa chỉ email này đã được sử dụng.',
    [ErrorCode.USER.USERNAME_EXISTS]: 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác.',
    [ErrorCode.USER.PHONE_EXISTS]: 'Số điện thoại này đã được đăng ký.',
    [ErrorCode.USER.REGISTER_FAILED]: 'Quá trình đăng ký gặp lỗi, vui lòng kiểm tra lại.',
    [ErrorCode.USER.UPDATE_FAILED]: 'Cập nhật thông tin không thành công.',
    [ErrorCode.AUTH.ROLES_NOT_INITIALIZED]: 'Vai trò người dùng chưa được khởi tạo hoặc không tồn tại trong hệ thống.',

    // === SMART-GPLX (EXAM & AI) ===
    [ErrorCode.EXAM.NOT_FOUND]: 'Đề thi không tồn tại hoặc đã bị gỡ bỏ.',
    [ErrorCode.EXAM.ALREADY_SUBMITTED]: 'Bạn đã nộp bài thi này rồi, không thể thực hiện lại.',
    [ErrorCode.EXAM.EXPIRED]: 'Thời gian làm bài đã kết thúc.',
    [ErrorCode.EXAM.AI_PROCESSING_ERROR]: 'Hệ thống AI gặp sự cố khi xử lý dữ liệu, vui lòng thử lại.',
    [ErrorCode.EXAM.IMAGE_INVALID]: 'Ảnh chụp không rõ nét hoặc không chứa thông tin hợp lệ.',

    // === FILE & UPLOAD (FILE) ===
    [ErrorCode.FILE.UPLOAD_FAILED]: 'Tải tệp lên thất bại, vui lòng kiểm tra kết nối.',
    [ErrorCode.FILE.TOO_LARGE]: 'Kích thước tệp quá lớn, vui lòng chọn tệp nhẹ hơn.',
    [ErrorCode.FILE.INVALID_TYPE]: 'Định dạng tệp không hỗ trợ (Chỉ nhận .jpg, .png, .jpeg).',

    // === DATA VALIDATION (VAL) ===
    [ErrorCode.VALIDATION.INVALID_EMAIL]: 'Email không đúng định dạng (ví dụ: name@gmail.com).',
    [ErrorCode.VALIDATION.INVALID_PASSWORD]: 'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ và số.',
    [ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH]: 'Mật khẩu xác nhận không trùng khớp.',
    [ErrorCode.VALIDATION.MISSING_FIELD]: 'Vui lòng điền đầy đủ các thông tin bắt buộc.',
    [ErrorCode.VALIDATION.INVALID_FORMAT]: 'Dữ liệu không đúng định dạng yêu cầu.',
    [ErrorCode.VALIDATION.INVALID_LENGTH]: 'Độ dài dữ liệu nhập vào không hợp lệ.',
    [ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT]: 'Mật khẩu mới không được giống mật khẩu cũ.',
    [ErrorCode.VALIDATION.PASSWORD_DIFFERENT]: 'Mật khẩu cũ không chính xác.',
};