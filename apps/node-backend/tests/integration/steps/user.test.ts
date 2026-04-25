import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';

import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  USER_UPDATE_DATA,
  AUTH_PAYLOAD,
  Message,
  ErrorStatus,
} from '../../config/index'

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho quản lý người dùng.
 * Kịch bản: Tách biệt Token Admin/User và xử lý vòng đời Token sau khi đổi mật khẩu.
 */
export const userSteps = (
  getAdminToken: () => string,
) => {
  let regularUserId: string;
  let regularToken: string;
  let adminToken: string;

  // --- 🔑 SETUP: Lấy Token cho cả 2 tài khoản trước khi chạy test ---
  beforeAll(async () => {
    // 1. Lấy Token cho Regular User
    const userLogin = await request(app)
      .post(AUTH_ENDPOINTS.LOGIN)
      .send({
        username: AUTH_PAYLOAD.USER_TEST.username,
        password: AUTH_PAYLOAD.USER_TEST.newPassword,
      });

    regularToken = userLogin.body.data.accessToken;
    regularUserId = userLogin.body.data.user.id;

    adminToken = getAdminToken();
  });

  // Helper function để linh hoạt truyền token
  const getAuthHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
  });

  describe('👤 User Management API Suite', () => {

    // --- PHASE 1: USER SELF-MANAGEMENT ---
    describe('📝 Kịch bản: Người dùng tự quản lý thông tin', () => {

      it('Nên cập nhật thông tin cá nhân thành công', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PROFILE)
          .set(getAuthHeader(regularToken))
          .send(USER_UPDATE_DATA);

        regularToken = response.body.data.accessToken;
        expect(response.status).toBe(200);
        expect(response.body.data.user.fullName).toBe(USER_UPDATE_DATA.fullName);
        expect(response.body.message).toBe(Message.USER.UPDATE_SUCCESS);
      });

      it('Nên đổi mật khẩu thành công và CẬP NHẬT lại Token mới', async () => {
        // 1. Thực hiện đổi mật khẩu
        const res = await request(app)
          .patch(USER_ENDPOINTS.ME_PASSWORD)
          .set(getAuthHeader(regularToken))
          .send({
            oldPassword: AUTH_PAYLOAD.USER_TEST.newPassword,
            newPassword: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
            confirmNewPassword: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
          });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(Message.USER.PASSWORD_CHANGED);

        // 2. 💡 QUAN TRỌNG: Login lại bằng mật khẩu mới để lấy token mới
        const refreshRes = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: AUTH_PAYLOAD.USER_TEST.username,
            password: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
          });

        // Ghi đè token mới để dùng cho các test sau (nếu có)
        regularToken = refreshRes.body.data.accessToken;
      });
    });

    // --- PHASE 2: ADMIN MANAGEMENT ---
    describe('🚫 Kịch bản: Quyền Quản trị viên (Admin Actions)', () => {

      it('Nên cho phép Admin cập nhật trạng thái người dùng khác', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.USER_STATUS(regularUserId))
          .set(getAuthHeader(adminToken)) // Dùng token Admin
          .send({ status: 'active' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.STATUS_UPDATED);
      });

      it('Nên cho phép Admin Xóa mềm và Khôi phục tài khoản', async () => {
        // Bước 1: Admin Xóa mềm User
        const deleteRes = await request(app)
          .delete(USER_ENDPOINTS.USER_DELETE(regularUserId))
          .set(getAuthHeader(adminToken));
        expect(deleteRes.status).toBe(200);

        // Bước 2: Kiểm tra User không thể login sau khi bị xóa (423 Locked)
        const loginFail = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: AUTH_PAYLOAD.USER_TEST.username,
            password: AUTH_PAYLOAD.USER_TEST.newPassword,
          });
        expect(loginFail.status).toBe(ErrorStatus.AUTH_423);

        // Bước 3: Admin Khôi phục tài khoản
        const restoreRes = await request(app)
          .patch(USER_ENDPOINTS.USER_RESTORE(regularUserId))
          .set(getAuthHeader(adminToken));
        expect(restoreRes.status).toBe(200);
      });

      it('Nên trả về danh sách người dùng khi là Admin', async () => {
        const response = await request(app)
          .get(USER_ENDPOINTS.USERS_LIST)
          .set(getAuthHeader(adminToken))
          .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });
    });

    // --- PHASE 3: SECURITY & AUTHORIZATION ---
    describe('🔒 Kịch bản: Bảo mật & Phân quyền', () => {

      it('Nên từ chối (403) khi User thường cố gắng lấy danh sách người dùng', async () => {
        const response = await request(app)
          .get(USER_ENDPOINTS.USERS_LIST)
          .set(getAuthHeader(regularToken)); // Dùng token User thường

        expect(response.status).toBe(403); // Forbidden
        expect(response.body.success).toBe(false);
      });

      // it('Nên đăng xuất thành công và hủy bỏ phiên làm việc', async () => {
      //   const res = await request(app)
      //     .post(AUTH_ENDPOINTS.LOGOUT)
      //     .set(getAuthHeader(regularToken));

      //   expect(res.status).toBe(200);
      //   expect(res.body.code).toBe('AUTH_LOGOUT_SUCCESS');
      // });
    });
  });
};