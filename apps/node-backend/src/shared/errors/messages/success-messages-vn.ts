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
    PASSWORD_RESET: 'Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng nhập lại.',
    TOKEN_REFRESHED: 'Làm mới phiên đăng nhập thành công.',
  } as const;

  /**
   * Thông báo liên quan đến luồng Người dùng (User Management)
   */
  static readonly USER = {
    UPDATE_SUCCESS: 'Cập nhật thông tin người dùng thành công.',
    PASSWORD_CHANGED: 'Thay đổi mật khẩu thành công.',
    STATUS_UPDATED: 'Cập nhật trạng thái người dùng thành công.',
    DELETE_SUCCESS: 'Xóa tài khoản thành công.',
    RESTORE_SUCCESS: 'Khôi phục tài khoản thành công',
    FETCH_USER: 'Lấy danh sách người dùng thành công',
  } as const;

  /**
   * Thông báo chung cho hệ thống (System)
   */
  static readonly SYSTEM = {
    ACTION_SUCCESS: 'Thao tác thực hiện thành công.',
    DATA_RETRIEVED: 'Lấy dữ liệu thành công.',
  } as const;

  static readonly LICENSE = {
    CREATE_SUCCESS: 'Thêm mới hạng bằng lái thành công.',
    UPDATE_SUCCESS: 'Cập nhật thông tin hạng bằng lái thành công.',
    DELETE_SUCCESS: 'Xóa hạng bằng lái thành công.',
    FETCH_SUCCESS: 'Lấy danh sách hạng bằng lái thành công.',
    RESTORE_SUCCESS: 'Khôi phục bằng lái bằng lái thành công.',
  } as const;

  static readonly CHAPTER = {
    CREATE_SUCCESS: 'Thêm mới chương lý thuyết thành công.',
    UPDATE_SUCCESS: 'Cập nhật thông tin chương lý thuyết thành công.',
    DELETE_SUCCESS: 'Xóa chương lý thuyết thành công.',
    FETCH_SUCCESS: 'Lấy danh sách chương lý thuyết thành công.',
    RESTORE_SUCCESS: 'Khôi phục chương lý thuyết thành công.',
  } as const

  static readonly QUESTION = {
    CREATE_SUCCESS: 'Thêm mới câu hỏi thành công.',
    UPDATE_SUCCESS: 'Cập nhật thông tin câu hỏi thành công.',
    DELETE_SUCCESS: 'Xóa câu hỏi thành công.',
    FETCH_SUCCESS: 'Lấy danh sách câu hỏi thành công.',
    FETCH_DETAIL_SUCCESS: 'Lấy chi tiết câu hỏi thành công.',
    RESTORE_SUCCESS: 'Khôi phục câu hỏi thành công.',
    IMPORT_SUCCESS: 'Nhập danh sách câu hỏi từ file thành công.',
    STATUS_UPDATE_SUCCESS: 'Cập nhật trạng thái câu hỏi thành công.',
  } as const;
}