// auth-steps.test.ts
import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';
import { redisClient } from '@/infrastructure/database/redis/redis.client';

import {
  AUTH_ENDPOINTS,
  TEST_ACCOUNT,
  INVALID_TEST_DATA,
  TEST_EMAIL,
  NEW_PASSWORD,
  Message,
  ErrorCode,
  ErrorStatus,
  REDIS_KEYS,
} from '../../test.data';

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho hệ thống xác thực.
 * Sử dụng tư duy Scenario-based để giảm sự gò bó và tăng tính linh hoạt.
 */
export const authSteps = () => {
  // --- HELPERS ---
  const getOtpFromRedis = async (email: string): Promise<string | null> => {
    return await redisClient.get(REDIS_KEYS.getOtpKey(email));
  };

  const clearUserData = async (email: string) => {
    const keys = [
      REDIS_KEYS.getOtpKey(email),
      REDIS_KEYS.getResendLockKey(email),
      REDIS_KEYS.getPendingUserKey(email),
    ];
    await Promise.all(keys.map((key) => redisClient.del(key)));
  };

  const clearResendLock = async (email: string) => {
    await redisClient.del(REDIS_KEYS.getResendLockKey(email));
  };

  const delOTP = async (email: string) => {
    await redisClient.del(REDIS_KEYS.getResendLockKey(email));
    await redisClient.del(REDIS_KEYS.getOtpKey(email));
  };

  describe('🛡️ Auth API Integration Suite', () => {
    // Trước khi bắt đầu toàn bộ, dọn sạch dữ liệu
    beforeAll(async () => {
      await clearUserData(TEST_ACCOUNT.email);
      await clearResendLock(TEST_ACCOUNT.email);
    });

    describe('🚀 Kịch bản: Đăng ký người dùng mới', () => {
      it('Nên hoàn tất chu trình đăng ký từ lúc Init', async () => {
        const initRes = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_INIT)
          .send(TEST_ACCOUNT);

        expect(initRes.status).toBe(200);
        expect(initRes.body.message).toBe(Message.AUTH.OTP_EMAIL);
      }, 20000);

      it('should successfully resend OTP', async () => {
        await clearResendLock(TEST_ACCOUNT.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.RESEND_OTP)
          .send({ email: TEST_ACCOUNT.email });

        const otp = await getOtpFromRedis(TEST_ACCOUNT.email);

        expect(otp).toBeDefined();
        expect(response.status).toBe(200);
      }, 20000);

      it('Nên báo lỗi khi nhập SAI mã OTP (Verify Fail)', async () => {
        const res = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_VERIFY)
          .send({
            email: TEST_ACCOUNT.email,
            otp: '000000',
          });

        expect(res.status).toBe(ErrorStatus.AUTH_002);
        expect(res.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
      });

      it('should successfully verify OTP', async () => {
        const otp = await getOtpFromRedis(TEST_ACCOUNT.email);
        expect(otp).toBeDefined();

        const response = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_VERIFY)
          .send({
            email: TEST_ACCOUNT.email,
            otp: otp,
          });

        expect(response.status).toBe(201);
      }, 10000);

      it('Nên chặn đăng ký khi Username đã bị chiếm dụng', async () => {
        const response = await request(app)
          .post(AUTH_ENDPOINTS.REGISTER_INIT)
          .send({
            ...TEST_ACCOUNT,
            email: 'another@email.com', // Email mới nhưng username cũ
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
            username: TEST_ACCOUNT.username,
            password: TEST_ACCOUNT.password,
          });

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.user.username).toBe(TEST_ACCOUNT.username);
      });

      it('Bảo mật: Phải trả về 404 Username và 401 cho Password', async () => {
        const res1 = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
          username: 'non_exist',
          password: 'any',
        });

        const res2 = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
          username: TEST_ACCOUNT.username,
          password: 'wrong',
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
          value: INVALID_TEST_DATA.invalidEmail,
          code: ErrorCode.VALIDATION.INVALID_EMAIL,
        },
        {
          label: 'Mật khẩu quá yếu',
          field: 'password',
          value: INVALID_TEST_DATA.weakPassword,
          code: ErrorCode.VALIDATION.INVALID_PASSWORD,
        },
      ];

      validationCases.forEach(({ label, field, value, code }) => {
        it(`Nên trả về lỗi khi ${label}`, async () => {
          const response = await request(app)
            .post(AUTH_ENDPOINTS.REGISTER_INIT)
            .send({ ...TEST_ACCOUNT, [field]: value });

          expect(response.status).toBe(ErrorStatus.USER_003);
          expect(response.body.code).toBe(code);
        });
      });
    });
  });

  describe('🔑 Kịch bản: Quên mật khẩu (Forgot Password Flow)', () => {
    describe('Step 1: Gửi yêu cầu OTP (Forgot Password Request)', () => {
      it('Nên gửi OTP thành công khi Email tồn tại', async () => {
        await clearResendLock(TEST_ACCOUNT.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: TEST_ACCOUNT.email });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          success: true,
          code: 'AUTH_OTP_SENT_SUCCESS',
        });
      }, 10000);

      it('Nên báo lỗi khi Email không tồn tại trong hệ thống', async () => {
        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: 'nonexistent@gmail.com' });

        expect(response.body.code).toBe(ErrorCode.USER.NOT_FOUND);
      });

      it('Nên báo lỗi TOO_MANY_REQUESTS khi nhấn gửi lại quá nhanh', async () => {
        await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: TEST_EMAIL });

        const response = await request(app)
          .post(AUTH_ENDPOINTS.FORGOT_PASSWORD)
          .send({ email: TEST_EMAIL });

        expect(response.body.code).toBe(ErrorCode.SYSTEM.TOO_MANY_REQUESTS);
      });
    });

    describe('Step 2: Xác thực & Đặt lại mật khẩu (Reset Password)', () => {
      it('Nên báo lỗi khi nhập sai mã OTP', async () => {
        const response = await request(app)
          .post(AUTH_ENDPOINTS.RESET_PASSWORD)
          .send({
            email: TEST_EMAIL,
            otp: '000000',
            newPassword: NEW_PASSWORD,
          });

        expect(response.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
      });

      it('Nên đặt lại mật khẩu thành công với OTP hợp lệ', async () => {
        const otpCode = await getOtpFromRedis(TEST_ACCOUNT.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.RESET_PASSWORD)
          .send({
            email: TEST_EMAIL,
            otp: otpCode,
            newPassword: NEW_PASSWORD,
          });

        expect(response.status).toBe(200);
        expect(response.body.code).toBe('AUTH_PASSWORD_RESET_SUCCESS');
      });

      it('Nên đăng nhập thành công với mật khẩu mới', async () => {
        const loginResponse = await request(app)
          .post(AUTH_ENDPOINTS.LOGIN)
          .send({ username: TEST_EMAIL, password: NEW_PASSWORD });

        expect(loginResponse.status).toBe(200);
      });

      it('Nên báo lỗi khi mã OTP đã hết hạn hoặc không tồn tại', async () => {
        await delOTP(TEST_ACCOUNT.email);

        const response = await request(app)
          .post(AUTH_ENDPOINTS.RESET_PASSWORD)
          .send({
            email: TEST_EMAIL,
            otp: '123456',
            newPassword: NEW_PASSWORD,
          });

        expect(response.body.code).toBe(ErrorCode.AUTH.OTP_EXPIRED);
      });
    });
  });
};