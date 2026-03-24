/**
 * Class quản lý tập trung toàn bộ các thông báo thành công / thông tin 
 * (Success / Info Messages) trả về cho Client.
 */
export class Message {
  /**
   * Thông báo liên quan đến luồng Xác thực (Authentication)
   */
  static readonly AUTH = {
    OTP_EMAIL: 'Mã xác thực (OTP code) đã được gửi đến email của bạn. Vui lòng kiểm tra.',
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công.',
    LOGIN_SUCCESS: 'Đăng nhập thành công.',
    OTP_RESENT: 'Mã OTP mới đã được gửi vào email của bạn.',
    LOGOUT_SUCCESS: 'Đăng xuất thành công.',
  } as const;

  /**
   * Thông báo liên quan đến luồng Người dùng (User Management)
   */
  static readonly USER = {
    UPDATE_SUCCESS: 'Cập nhật thông tin người dùng thành công.',
    PASSWORD_CHANGED: 'Thay đổi mật khẩu thành công.',
    STATUS_UPDATED: 'Cập nhật trạng thái người dùng thành công.',
    DELETE_SUCCESS: 'Xóa tài khoản thành công.',
  } as const;

  /**
   * Thông báo chung cho hệ thống (System)
   */
  static readonly SYSTEM = {
    ACTION_SUCCESS: 'Thao tác thực hiện thành công.',
    DATA_RETRIEVED: 'Lấy dữ liệu thành công.',
  } as const;
}