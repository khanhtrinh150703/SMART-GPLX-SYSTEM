// auth-steps.test.ts
import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { AUTH_ENDPOINTS, AUTH_PAYLOAD, ErrorCode, ErrorStatus, fakeEmail, fakeOtp, Message } from '../../config/index';
import { REDIS_KEYS } from '@/shared/config/redis.config';

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho hệ thống xác thực.
 * Sử dụng tư duy Scenario-based để giảm sự gò bó và tăng tính linh hoạt.
 */
export const authSteps = () => {
  // --- HELPERS ---
  /** Lấy OTP từ Redis */
  const getOtpFromRedis = async (email: string): Promise<string | null> => {
    return await redisClient.get(REDIS_KEYS.AUTH.getOtpKey(email));
  };

  /** Xóa toàn bộ dữ liệu liên quan đến Auth của User (OTP, Lock, Pending) */
  const clearUserData = async (email: string) => {
    const keys = [
      REDIS_KEYS.AUTH.getOtpKey(email),
      REDIS_KEYS.AUTH.getResendLockKey(email),
      REDIS_KEYS.AUTH.getPendingUserKey(email),
    ];
    return await redisClient.del(...keys); // Xóa tất cả trong 1 command
  };

  /** Xóa khóa chặn gửi lại OTP */
  const clearResendLock = async (email: string) => {
    return await redisClient.del(REDIS_KEYS.AUTH.getResendLockKey(email));
  };

  /** Xóa OTP và Khóa gửi lại (Thường dùng sau khi verify thành công) */
  const delOTP = async (email: string) => {
    return await redisClient.del(
      REDIS_KEYS.AUTH.getOtpKey(email),
      REDIS_KEYS.AUTH.getResendLockKey(email)
    );
  };

  describe('🛡️ Auth API Integration Suite', () => {
    // Trước khi bắt đầu toàn bộ, dọn sạch dữ liệu
    beforeAll(async () => {
      await clearUserData(AUTH_PAYLOAD.USER_TEST.email);
      await clearResendLock(AUTH_PAYLOAD.USER_TEST.email);
    });

    describe('🚀 Kịch bản: Đăng ký người dùng mới', () => {
      it('Nên hoàn tất chu trình đăng ký từ lúc Init', async () => {
        const initRes = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_INIT)
          .send({
            username: AUTH_PAYLOAD.USER_TEST.username,
            email: AUTH_PAYLOAD.USER_TEST.email,
            fullName: AUTH_PAYLOAD.USER_TEST.fullName,
            password: AUTH_PAYLOAD.USER_TEST.password,
            confirmPassword: AUTH_PAYLOAD.USER_TEST.confirmPassword,
          });

        expect(initRes.status).toBe(200);
        expect(initRes.body.message).toBe(Message.AUTH.OTP_EMAIL);
      }, 20000);

      it('Nên gửi lại mã OTP thành công', async () => {
        // Xóa lock để có thể gửi lại ngay lập tức trong môi trường test
        await clearResendLock(AUTH_PAYLOAD.USER_TEST.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.RESEND_OTP)
          .send({ email: AUTH_PAYLOAD.USER_TEST.email });

        const otp = await getOtpFromRedis(AUTH_PAYLOAD.USER_TEST.email);

        expect(otp).toBeDefined();
        expect(response.status).toBe(200);
      }, 20000);
    });

    it('Nên báo lỗi khi nhập SAI mã OTP (Verify Fail)', async () => {
      const res = await request(app)
        .post(AUTH_ENDPOINTS.REGISTER_VERIFY)
        .send({
          email: AUTH_PAYLOAD.USER_TEST.email,
          otp: fakeOtp
        });

      expect(res.status).toBe(ErrorStatus.AUTH_002);
      expect(res.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
    });

    it('Nên xác thực mã OTP thành công', async () => {
      const otp = await getOtpFromRedis(AUTH_PAYLOAD.USER_TEST.email);
      expect(otp).toBeDefined();

      const response = await request(app)
        .post(AUTH_ENDPOINTS.REGISTER_VERIFY)
        .send({
          email: AUTH_PAYLOAD.USER_TEST.email,
          otp: otp,
        });

      expect(response.status).toBe(201);
    }, 10000);

    it('Nên chặn đăng ký khi Username đã bị chiếm dụng', async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.REGISTER_INIT)
        .send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          email: fakeEmail,
          fullName: AUTH_PAYLOAD.USER_TEST.fullName,
          password: AUTH_PAYLOAD.USER_TEST.password,
          confirmPassword: AUTH_PAYLOAD.USER_TEST.confirmPassword,
        });

      expect(response.status).toBe(ErrorStatus.USER_409);
      expect(response.body.code).toBe(ErrorCode.USER.USERNAME_EXISTS);
    });
  });

  describe('🔑 Kịch bản: Đăng nhập hệ thống', () => {
    it('Nên cấp Access Token khi thông tin chính xác', async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.LOGIN)
        .send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.username).toBe(AUTH_PAYLOAD.USER_TEST.username);
    });

    it('Bảo mật: Phải trả về lỗi 401 khi thông tin không chính xác (Username/Password)', async () => {
      // Trường hợp 1: Username không tồn tại
      const res1 = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
        username: 'non_exist_user',
        password: AUTH_PAYLOAD.USER_TEST.password,
      });

      // Trường hợp 2: Sai mật khẩu
      const res2 = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
        username: AUTH_PAYLOAD.USER_TEST.username,
        password: AUTH_PAYLOAD.USER_TEST.wrongPassword,
      });

      expect(res1.status).toBe(ErrorStatus.AUTH_001);
      expect(res2.status).toBe(ErrorStatus.AUTH_001);
      expect(res1.body.code).toBe(ErrorCode.AUTH.INVALID_CREDENTIALS);
      expect(res2.body.code).toBe(ErrorCode.AUTH.INVALID_CREDENTIALS);
    });
  });

  describe('❌ Kịch bản: Kiểm tra lỗi dữ liệu (Validation)', () => {
    const validationCases = [
      {
        label: 'Email sai định dạng',
        field: 'email',
        value: AUTH_PAYLOAD.INVALID_DATA.email,
        code: ErrorCode.VALIDATION.EMAIL_INVALID,
      },
      {
        label: 'Mật khẩu quá yếu',
        field: 'password',
        value: AUTH_PAYLOAD.INVALID_DATA.shortPassword,
        code: ErrorCode.VALIDATION.PASSWORD_INVALID,
      },
    ];

    validationCases.forEach(({ label, field, value, code }) => {
      it(`Nên trả về lỗi khi ${label}`, async () => {
        const response = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_INIT)
          .send({
            ...AUTH_PAYLOAD.USER_TEST,
            [field]: value
          });

        expect(response.status).toBe(ErrorStatus.USER_003);
        expect(response.body.code).toBe(code);
      });
    });
  });

  describe('🔑 Kịch bản: Quên mật khẩu (Forgot Password Flow)', () => {
    describe('Step 1: Gửi yêu cầu OTP (Forgot Password Request)', () => {
      it('Nên gửi OTP thành công khi Email tồn tại', async () => {
        // Đảm bảo không bị dính lock resend từ các test trước
        await clearResendLock(AUTH_PAYLOAD.USER_TEST.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: AUTH_PAYLOAD.USER_TEST.email });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          success: true,
          code: 'AUTH_OTP_SENT_SUCCESS',
        });
      }, 10000);

      it('Nên báo lỗi khi Email không tồn tại trong hệ thống', async () => {
        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: 'nonexistent_user@gmail.com' });

        expect(response.body.code).toBe(ErrorCode.USER.NOT_FOUND);
      });

      it('Nên báo lỗi TOO_MANY_REQUESTS khi nhấn gửi lại quá nhanh', async () => {
        // Lần 1: Gửi thành công (sau khi đã clear lock)
        await clearResendLock(AUTH_PAYLOAD.USER_TEST.email);
        await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: AUTH_PAYLOAD.USER_TEST.email });

        // Lần 2: Gửi ngay lập tức sẽ bị chặn bởi Rate Limit/Resend Lock
        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: AUTH_PAYLOAD.USER_TEST.email });

        expect(response.body.code).toBe(ErrorCode.SYSTEM.TOO_MANY_REQUESTS);
      });
    });
  });

  describe('Step 2: Xác thực & Đặt lại mật khẩu (Reset Password)', () => {
    it('Nên báo lỗi khi nhập sai mã OTP', async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.RESET_PASSWORD)
        .send({
          email: AUTH_PAYLOAD.USER_TEST.email,
          otp: '000000',
          newPassword: AUTH_PAYLOAD.USER_TEST.newPassword,
        });

      expect(response.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
    });

    it('Nên đặt lại mật khẩu thành công với OTP hợp lệ', async () => {
      // Lấy mã OTP thực tế từ Redis để test case thành công
      const otpCode = await getOtpFromRedis(AUTH_PAYLOAD.USER_TEST.email);

      const response = await request(app)
        .post(AUTH_ENDPOINTS.RESET_PASSWORD)
        .send({
          email: AUTH_PAYLOAD.USER_TEST.email,
          otp: otpCode,
          newPassword: AUTH_PAYLOAD.USER_TEST.newPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe('AUTH_PASSWORD_RESET_SUCCESS');
    });

    it('Nên đăng nhập thành công với mật khẩu mới sau khi reset', async () => {
      const loginResponse = await request(app)
        .post(AUTH_ENDPOINTS.LOGIN)
        .send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.newPassword
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data.accessToken).toBeDefined();
    });

    it('Nên báo lỗi khi mã OTP đã hết hạn hoặc không tồn tại', async () => {
      // Chủ động xóa OTP trong Redis để giả lập tình trạng hết hạn
      await delOTP(AUTH_PAYLOAD.USER_TEST.email);

      const response = await request(app)
        .post(AUTH_ENDPOINTS.RESET_PASSWORD)
        .send({
          email: AUTH_PAYLOAD.USER_TEST.email,
          otp: '123456',
          newPassword: AUTH_PAYLOAD.USER_TEST.newPassword,
        });

      expect(response.body.code).toBe(ErrorCode.AUTH.OTP_EXPIRED);
    });
  });

  describe('🔄 Kịch bản: Làm mới mã xác thực (Refresh Token Flow)', () => {
    let validRefreshToken = '';

    // Bước chuẩn bị: Lấy một Refresh Token hợp lệ trước khi bắt đầu test
    beforeAll(async () => {
      // 1. Gọi API Login để lấy token mới nhất
      // Lưu ý: Lúc này mật khẩu đã là newPassword sau khi thực hiện reset/change ở các bước trước
      const loginRes = await request(app)
        .post(AUTH_ENDPOINTS.LOGIN)
        .send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.newPassword
        });

      // 2. Gán Refresh Token vào biến dùng chung cho bộ test
      validRefreshToken = loginRes.body.data?.refreshToken || '';
    });

    it('Nên báo lỗi khi KHÔNG truyền Refresh Token (Thiếu dữ liệu)', async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.REFRESH_TOKEN)
        .send({}); // Gửi body rỗng

      // Kỳ vọng trả về lỗi 400 (Bad Request)
      expect(response.status).toBe(400);
      expect(response.body.code).toBe(ErrorCode.VALIDATION.REFRESH_TOKEN_REQUIRED);
    });

    it('Nên báo lỗi khi Refresh Token sai định dạng (Quá ngắn)', async () => {
      const response = await request(app)
        .post(AUTH_ENDPOINTS.REFRESH_TOKEN)
        .send({ refreshToken: 'chuoi-nay-qua-ngan-duoi-40-ky-tu' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(ErrorCode.VALIDATION.REFRESH_TOKEN_INVALID);
    });

    it('Nên báo lỗi INVALID_TOKEN khi Token là giả mạo hoặc không tồn tại (Session không hợp lệ)', async () => {
      // Tạo một token giả mạo nhưng đủ độ dài (> 40 ký tự) để vượt qua lớp Validation đầu tiên
      const fakeLongToken = 'fake-jwt-token-that-is-long-enough-to-pass-validation-length-check-123456789';

      const response = await request(app)
        .post(AUTH_ENDPOINTS.REFRESH_TOKEN)
        .send({ refreshToken: fakeLongToken });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe(ErrorCode.AUTH.INVALID_TOKEN);
    });

    it('Nên cấp mới bộ Token thành công khi sử dụng Refresh Token hợp lệ', async () => {
      // Đảm bảo là có token thật để test
      expect(validRefreshToken).not.toBe('');

      const response = await request(app)
        .post(AUTH_ENDPOINTS.REFRESH_TOKEN)
        .send({ refreshToken: validRefreshToken });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      // Đảm bảo token mới phải khác token cũ (Kiểm tra cơ chế Token Rotation)
      expect(response.body.data.refreshToken).not.toBe(validRefreshToken);
    });
  });
};