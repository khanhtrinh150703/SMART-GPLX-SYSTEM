/**
 * @description Giao diện định nghĩa các dịch vụ gửi thông báo qua Email.
 * Đóng vai trò là một "Adapter" để kết nối với các nhà cung cấp dịch vụ Email bên ngoài (như Nodemailer, SendGrid, Amazon SES...).
 */
export interface IEmailService {
  /**
   * @description Thực hiện gửi mã xác thực (OTP) tới địa chỉ email của người nhận để phục vụ quy trình xác minh tài khoản hoặc khôi phục mật khẩu.
   * @param {string} recipientEmail - Địa chỉ email đích cần gửi mã.
   * @param {string} otpCode - Mã số xác thực được sinh ra từ hệ thống.
   * @returns {Promise<void>} Trả về một Promise đại diện cho trạng thái gửi thành công hoặc thất bại của tác vụ bất đồng bộ.
   */
  sendOtpEmail(recipientEmail: string, otpCode: string): Promise<void>;
}