// user-management.test.ts
import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';

import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  TEST_ACCOUNT,
  TEST_UPDATE_DATA,
  Message,
  ErrorCode,
  ErrorStatus,
} from '../../test.data';

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho quản lý người dùng.
 * Tuân thủ cấu trúc Scenario-based, Zero Any và bảo mật tuyệt đối.
 */
export const userSteps = () => {
  let userId: string;
  let accessToken: string;

  // --- BEFORE ALL: Đăng nhập để lấy token và userId ---
  beforeAll(async () => {
    const loginRes = await request(app)
      .post(AUTH_ENDPOINTS.LOGIN)
      .send({
        username: TEST_ACCOUNT.username,
        password: TEST_ACCOUNT.newPassword,
      });

    userId = loginRes.body.data.user.id;
    accessToken = loginRes.body.data.accessToken;
  });

  // --- HELPER FUNCTION ---
  const getAuthHeader = () => ({
    Authorization: `Bearer ${accessToken}`,
  });

  describe('👤 User Management API Suite', () => {
    describe('📝 Kịch bản: Đăng xuất tài khoản', () => {
      it('Nên đăng xuất thành công khi Token hợp lệ', async () => {
        const res = await request(app)
          .post(AUTH_ENDPOINTS.LOGOUT)
          .set(getAuthHeader());

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.code).toBe('AUTH_LOGOUT_SUCCESS');
        expect(res.body.message).toContain(Message.AUTH.LOGOUT_SUCCESS);
      });

      it('Nên trả về lỗi 401 khi đăng xuất mà không gửi kèm Token', async () => {
        const res = await request(app).post(AUTH_ENDPOINTS.LOGOUT);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe('📝 Kịch bản: Đăng nhập bằng Email', () => {
      it('Nên đăng nhập thành công khi sử dụng Email hợp lệ', async () => {
        const res = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: TEST_ACCOUNT.email,
            password: TEST_ACCOUNT.newPassword,
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.email).toBe(TEST_ACCOUNT.email);
        accessToken = res.body.data.accessToken;
      });

      it('Nên trả về lỗi 401 khi đăng nhập bằng email nhưng sai mật khẩu', async () => {
        const res = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: TEST_ACCOUNT.email,
            password: 'WrongPassword123',
          });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe('📝 Kịch bản: Cập nhật thông tin cá nhân (Profile)', () => {
      it('Nên cập nhật thành công khi dữ liệu hợp lệ và có Token', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PROFILE)
          .set(getAuthHeader())
          .send(TEST_UPDATE_DATA);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.fullName).toBe(TEST_UPDATE_DATA.fullName);
        expect(response.body.message).toBe(Message.USER.UPDATE_SUCCESS);
      });

      it('Nên bị chặn (401) nếu không gửi kèm Access Token', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PROFILE)
          .send({ fullName: 'Hacker' });

        expect(response.status).toBe(ErrorStatus.AUTH_005);
      });
    });

    describe('🔐 Kịch bản: Quản lý mật khẩu (Password)', () => {
      it('Nên báo lỗi khi mật khẩu cũ không chính xác', async () => {
        const payload = {
          oldPassword: 'wrong_password_123',
          newPassword: TEST_ACCOUNT.newPassword,
          confirmNewPassword: TEST_ACCOUNT.newPassword,
        };

        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PASSWORD)
          .set(getAuthHeader())
          .send(payload);

        expect(response.body).toMatchObject({
          success: false,
          code: ErrorCode.VALIDATION.PASSWORD_DIFFERENT,
        });
        expect(response.body.message).toBeDefined();
      });

      it('Nên đổi mật khẩu thành công khi mọi thứ hợp lệ', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PASSWORD)
          .set(getAuthHeader())
          .send({
            oldPassword: TEST_ACCOUNT.newPassword,
            newPassword: TEST_ACCOUNT.newPassword_2,
            confirmNewPassword: TEST_ACCOUNT.newPassword_2,
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.PASSWORD_CHANGED);
      });
    });

    describe('🚫 Kịch bản: Admin quản lý trạng thái và Xóa', () => {

      beforeAll(async () => {
        const loginRes = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: TEST_ACCOUNT.username,
            // 💡 QUAN TRỌNG: Dùng password mới nhất sau khi đã đổi ở test trước
            password: TEST_ACCOUNT.newPassword_2,
          });

        if (loginRes.body.data) {
          userId = loginRes.body.data.user.id;
          accessToken = loginRes.body.data.accessToken;
        }
      });

      it('Nên cập nhật trạng thái người dùng thành công', async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.USER_STATUS(userId))
          .set(getAuthHeader())
          .send({ status: 'active' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.STATUS_UPDATED);
      });

      it('Nên quản lý vòng đời tài khoản: Xóa mềm và Khôi phục', async () => {
        // BƯỚC 1: Xóa mềm
        const deleteRes = await request(app)
          .delete(USER_ENDPOINTS.USER_DELETE(userId))
          .set(getAuthHeader());

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe(Message.USER.DELETE_SUCCESS);

        // BƯỚC 2: Kiểm tra không thể đăng nhập sau khi xóa mềm
        const loginFailRes = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.newPassword_2,
          });
        expect(loginFailRes.status).toBe(ErrorStatus.AUTH_423);
        expect(loginFailRes.body.code).toBe(ErrorCode.AUTH.ACCOUNT_LOCKED);

        // BƯỚC 3: Khôi phục tài khoản
        const restoreRes = await request(app)
          .patch(USER_ENDPOINTS.USER_RESTORE(userId))
          .set(getAuthHeader());

        expect(restoreRes.status).toBe(200);
        expect(restoreRes.body.code).toBe('USER_RESTORED_SUCCESS');

        // BƯỚC 4: Kiểm tra đăng nhập lại thành công
        const loginSuccessRes = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.newPassword_2,
          });

        expect(loginSuccessRes.status).toBe(200);
        expect(loginSuccessRes.body.success).toBe(true);
        expect(loginSuccessRes.body.data.accessToken).toBeDefined();
        expect(loginSuccessRes.body.data.user.status).toBe('active');
      });
    });

    describe('📝 Kịch bản: Quản trị - Lấy danh sách người dùng', () => {
      it('Nên trả về danh sách có phân trang khi là Admin', async () => {
        const response = await request(app)
          .get(USER_ENDPOINTS.USERS_LIST)
          .query({ page: 1, limit: 10, search: 'cauVag' })
          .set(getAuthHeader());

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.code).toBe('USER_FETCH_SUCCESS');

        expect(response.body.data).toHaveProperty('data');
        expect(Array.isArray(response.body.data.data)).toBe(true);

        const firstUser = response.body.data.data[0];
        if (firstUser) {
          expect(firstUser).toHaveProperty('email');
          expect(firstUser).toHaveProperty('roles');
          expect(Array.isArray(firstUser.roles)).toBe(true);
        }

        const meta = response.body.data.meta;
        expect(meta.page).toBe(1);
        expect(meta.limit).toBe(10);
        expect(meta).toHaveProperty('total');
        expect(meta).toHaveProperty('totalPages');
      });
    });
  });
};