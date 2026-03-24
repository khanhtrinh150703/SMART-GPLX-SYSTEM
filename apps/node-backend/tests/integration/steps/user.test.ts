import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';
import { ErrorCode, ErrorStatus } from '@/shared/errors';
import { Message } from '@/shared/errors/messages/success-messages-vn';

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho quản lý người dùng.
 * Tuân thủ cấu trúc Scenario-based, Zero Any và bảo mật tuyệt đối.
 */
export const userSteps = () => {
  // --- CONFIGURATION (Cấu hình tập trung) ---
  const API_USER = '/api/v1/users';
  const API_AUTH = '/api/v1/auth';

  const TEST_ACCOUNT = {
    username: 'trinh_cau_vang',
    password: 'Password123!',
    newPassword: 'NewPassword123!',
    wrongPassword: 'WrongPassword123!'
  };

  let userId: string;
  let accessToken: string;

  // --- HELPERS (Hàm hỗ trợ lấy Header xác thực) ---
  const getAuthHeader = () => ({ Authorization: `Bearer ${accessToken}` });

  describe('👤 User Management API Suite', () => {

    // CHUẨN BỊ: Đăng nhập để lấy Token và ID trước khi quẩy
    beforeAll(async () => {
      const loginRes = await request(app)
        .post(`${API_AUTH}/login`)
        .send({
          username: TEST_ACCOUNT.username,
          password: TEST_ACCOUNT.password
        });
      console.log(loginRes.body)
      userId = loginRes.body.data.user.id;
      accessToken = loginRes.body.data.accessToken;
    });

    describe('📝 Kịch bản: Cập nhật thông tin cá nhân (Profile)', () => {
      
      it('Nên cập nhật thành công khi dữ liệu hợp lệ và có Token', async () => {
        const updateData = {
          fullName: 'Trinh Cậu Vàng V2',
          urlPicture: 'https://cdn.smart-gplx.com/avatar.png'
        };

        const response = await request(app)
          .patch(`${API_USER}/${userId}/profile`)
          .set(getAuthHeader()) // Gửi kèm Token
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.fullName).toBe(updateData.fullName);
        expect(response.body.message).toBe(Message.USER.UPDATE_SUCCESS);
      });

      // it('Nên bị chặn (401) nếu không gửi kèm Access Token', async () => {
      //   const response = await request(app)
      //     .patch(`${API_USER}/${userId}/profile`)
      //     .send({ fullName: 'Hacker' });

      //   expect(response.status).toBe(ErrorStatus.AUTH_005);
      // });
    });

    describe('🔐 Kịch bản: Quản lý mật khẩu (Password)', () => {

      it('Nên báo lỗi khi mật khẩu cũ không chính xác', async () => {
        const response = await request(app)
          .patch(`${API_USER}/${userId}/password`)
          .set(getAuthHeader())
          .send({
            oldPassword: TEST_ACCOUNT.wrongPassword,
            newPassword: TEST_ACCOUNT.newPassword,
            confirmNewPassword: TEST_ACCOUNT.newPassword
          });

        expect(response.status).toBe(ErrorStatus.AUTH_001);
        expect(response.body.code).toBe(ErrorCode.AUTH.INVALID_CREDENTIALS);
      });

      it('Nên báo lỗi khi mật khẩu mới và xác nhận không khớp', async () => {
        const response = await request(app)
          .patch(`${API_USER}/${userId}/password`)
          .set(getAuthHeader())
          .send({
            oldPassword: TEST_ACCOUNT.password,
            newPassword: TEST_ACCOUNT.newPassword,
            confirmNewPassword: 'Khong_Khop_Dau_Ne'
          });

        expect(response.status).toBe(ErrorStatus.VAL_103);
        expect(response.body.code).toBe(ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH);
      });

      it('Nên đổi mật khẩu thành công khi mọi thứ hợp lệ', async () => {
        const response = await request(app)
          .patch(`${API_USER}/${userId}/password`)
          .set(getAuthHeader())
          .send({
            oldPassword: TEST_ACCOUNT.password,
            newPassword: TEST_ACCOUNT.newPassword,
            confirmNewPassword: TEST_ACCOUNT.newPassword
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.PASSWORD_CHANGED);
      });
    });

    describe('🚫 Kịch bản: Admin quản lý trạng thái và Xóa', () => {

      it('Nên cập nhật trạng thái người dùng thành công', async () => {
        const response = await request(app)
          .patch(`${API_USER}/${userId}/status`)
          .set(getAuthHeader())
          .send({ status: 'active' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.STATUS_UPDATED);
      });

      it('Nên xóa mềm tài khoản và từ chối đăng nhập sau đó', async () => {
        // 1. Thực hiện xóa mềm
        const deleteRes = await request(app)
          .delete(`${API_USER}/${userId}`)
          .set(getAuthHeader());

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe(Message.USER.DELETE_SUCCESS);

        // 2. Kiểm tra tính nhất quán: Đăng nhập lại phải thất bại (Account Locked)
        const loginRes = await request(app)
          .post(`${API_AUTH}/login`)
          .send({
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.newPassword // Dùng pass mới đã đổi ở trên
          });

        // Theo logic bảo mật chúng ta đã thống nhất: Đúng pass nhưng đã xóa -> 423 hoặc 401 tùy Cậu chọn
        expect(loginRes.status).toBe(ErrorStatus.AUTH_423); 
        expect(loginRes.body.code).toBe(ErrorCode.AUTH.ACCOUNT_LOCKED);
      });
    });
  });
};