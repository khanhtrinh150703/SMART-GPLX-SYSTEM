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
    email: 'gplx@dividesk.com',
    password: 'Password123!',
    newPassword: 'NewPassword123!',
    wrongPassword: 'WrongPassword123!'
  };

  let userId: string;
  let accessToken: string;

  // --- HELPERS (Hàm hỗ trợ lấy Header xác thực) ---


  beforeAll(async () => {
    const loginRes = await request(app)
      .post(`${API_AUTH}/login`)
      .send({
        username: TEST_ACCOUNT.username,
        password: TEST_ACCOUNT.password
      });

    // Gán dữ liệu cho các biến toàn cục trong file test
    userId = loginRes.body.data.user.id;
    accessToken = loginRes.body.data.accessToken;
  });

  // --- HÀM HỖ TRỢ (Helper) ---
  describe('👤 User Management API Suite', () => {

    // --- HÀM HỖ TRỢ (Helper) ---
    const getAuthHeader = () => ({ Authorization: `Bearer ${accessToken}` });

    describe('📝 Kịch bản: Đăng xuất tài khoản', () => {
      /**
       * Test case: Đăng xuất thành công.
       * Logic: Gửi Token lên, Server xóa Refresh Token trong Redis.
       */
      it('Nên đăng xuất thành công khi Token hợp lệ', async () => {
        const res = await request(app)
          .post(`${API_AUTH}/logout`)
          .set(getAuthHeader()); // <--- ĐÍNH KÈM TOKEN VÀO HEADER TẠI ĐÂY

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.code).toBe('AUTH_LOGOUT_SUCCESS');
        expect(res.body.message).toContain(Message.AUTH.LOGOUT_SUCCESS);
      });

      /**
       * Test case: Đăng xuất thất bại do không có Token.
       */
      it('Nên trả về lỗi 401 khi đăng xuất mà không gửi kèm Token', async () => {
        const res = await request(app).post(`${API_AUTH}/logout`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe('📝 Kịch bản: Đăng nhập bằng Email', () => {
      /**
       * Test case: Đăng nhập bằng email thay vì username.
       * Logic: Kiểm tra regex nhận diện email trong Service.
       */
      it('Nên đăng nhập thành công khi sử dụng Email hợp lệ', async () => {
        const res = await request(app)
          .post(`${API_AUTH}/login`)
          .send({
            username: TEST_ACCOUNT.email, // Gửi email vào trường username
            password: TEST_ACCOUNT.password
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.email).toBe(TEST_ACCOUNT.email);
      });

      /**
       * Test case: Đăng nhập thất bại khi sai mật khẩu.
       */
      it('Nên trả về lỗi 401 khi đăng nhập bằng email nhưng sai mật khẩu', async () => {
        const res = await request(app)
          .post(`${API_AUTH}/login`)
          .send({
            username: TEST_ACCOUNT.email,
            password: 'WrongPassword123'
          });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
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

      it('Nên quản lý vòng đời tài khoản: Xóa mềm (chặn login) và Khôi phục (cho phép login)', async () => {
        // --- BƯỚC 1: THỰC HIỆN XÓA MỀM ---
        const deleteRes = await request(app)
          .delete(`${API_USER}/${userId}`)
          // .set(getAuthHeader()); // Sử dụng token hiện tại để tự xóa hoặc dùng token Admin

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe(Message.USER.DELETE_SUCCESS);

        // --- BƯỚC 2: KIỂM TRA TÍNH NHẤT QUÁN (LOGIN PHẢI THẤT BẠI) ---
        // Dù đúng mật khẩu nhưng vì trạng thái đã bị xóa mềm -> Phải bị chặn
        const loginFailRes = await request(app)
          .post(`${API_AUTH}/login`)
          .send({
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.newPassword
          });

        // Trả về 423 (Locked) hoặc 401 tùy logic bạn chọn ở AuthService
        expect(loginFailRes.status).toBe(ErrorStatus.AUTH_423);
        expect(loginFailRes.body.code).toBe(ErrorCode.AUTH.ACCOUNT_LOCKED);

        // --- BƯỚC 3: KHÔI PHỤC TÀI KHOẢN (RESTORE) ---
        /** * LƯU Ý: Nếu authMiddleware của bạn chặn User đã xóa, 
         * thì ở bước này bạn cần dùng Token của ADMIN để restore.
         */
        const restoreRes = await request(app)
          .patch(`${API_USER}/${userId}/restore`)
          // .set(getAuthHeader()); // Giả định quyền Admin hoặc token còn hiệu lực

        expect(restoreRes.status).toBe(200);
        expect(restoreRes.body.code).toBe('USER_RESTORED_SUCCESS');

        // --- BƯỚC 4: KIỂM TRA ĐĂNG NHẬP LẠI THÀNH CÔNG ---
        const loginSuccessRes = await request(app)
          .post(`${API_AUTH}/login`)
          .send({
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.newPassword
          });

        expect(loginSuccessRes.status).toBe(200);
        expect(loginSuccessRes.body.success).toBe(true);
        expect(loginSuccessRes.body.data.accessToken).toBeDefined();
        // Kiểm tra xem status đã về 'active' chưa
        expect(loginSuccessRes.body.data.user.status).toBe('active');
      });
    });
  });
};