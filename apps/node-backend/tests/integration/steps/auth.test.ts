import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';
import { redisClient } from '@/infrastructure/database/redis/redis.client';
import { ErrorCode, ErrorStatus } from '@/shared/errors';
import { Message } from '@/shared/errors/messages/success-messages-vn';

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho hệ thống xác thực.
 * Sử dụng tư duy Scenario-based để giảm sự gò bó và tăng tính linh hoạt.
 */
export const authSteps = () => {
    // --- CONFIGURATION (Cấu hình tập trung) ---
    const API_PREFIX = '/api/v1/auth';
    const PATHS = {
        REGISTER_INIT: `${API_PREFIX}/register/init`,
        REGISTER_VERIFY: `${API_PREFIX}/register/verify`,
        LOGIN: `${API_PREFIX}/login`,
        RESEND_OTP: `${API_PREFIX}/resend-otp`,
    };

    const TEST_DATA = {
        validUser: {
            email: 'gplx@dividesk.com',
            username: 'trinh_cau_vang',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            fullName: 'Trinh Cậu Vàng'
        },
        invalidEmail: 'not-an-email',
        weakPassword: '123'
    };

    const TEST_EMAIL = 'gplx@dividesk.com';
    const NEW_PASSWORD = 'NewSecurePassword123@';

    // --- HELPERS (Các hàm hỗ trợ gỡ rối) ---
    const getOtpFromRedis = async (email: string): Promise<string | null> => {
        return await redisClient.get(`otp:${email.toLowerCase()}`);
    };

    const clearUserData = async (email: string) => {
        const keys = [`otp:${email}`, `resend_lock:${email}`, `pending_user:${email}`];
        await Promise.all(keys.map(key => redisClient.del(key)));
    };

    const clearResendLock = async (email: string) => {
        const lockKey = `otp_lock:${email}`; // Đảm bảo trùng với prefix trong Repo
        await redisClient.del(lockKey);
    };

    const delOTP = async (email: string) => {
        const lockKey = `otp_lock:${email}`; // Đảm bảo trùng với prefix trong Repo
        await redisClient.del(lockKey);

        await redisClient.del(`otp:${email}`);
    };


    describe('🛡️ Auth API Integration Suite', () => {

        // Trước khi bắt đầu toàn bộ, dọn sạch sân chơi
        beforeAll(async () => {
            await clearUserData(TEST_DATA.validUser.email);
            await clearResendLock(TEST_DATA.validUser.email);
        });

        describe('🚀 Kịch bản: Đăng ký người dùng mới', () => {

            it('Nên hoàn tất chu trình đăng ký từ lúc Init đến Verify', async () => {
                // Bước 1: Khởi tạo (Init)
                const initRes = await request(app)
                    .post(PATHS.REGISTER_INIT)
                    .send(TEST_DATA.validUser);

                expect(initRes.status).toBe(200);
                expect(initRes.body.message).toBe(Message.AUTH.OTP_EMAIL);
            }, 10000);

            it('should successfully resennd OTP', async () => {
                await clearResendLock(TEST_DATA.validUser.email);

                // 2. PHÁ KHOÁ: Xoá cái lock 60s đi ngay lập tức

                const response = await request(app)
                    .post(PATHS.RESEND_OTP)
                    .send({
                        email: TEST_DATA.validUser.email,
                    });

                const otp = await getOtpFromRedis(TEST_DATA.validUser.email) // Lấy trực tiếp chuỗi số

                expect(otp).toBeDefined();

                expect(response.status).toBe(200);
            }, 20000);

            it('Nên báo lỗi khi nhập SAI mã OTP (Verify Fail)', async () => {
                const res = await request(app)
                    .post(PATHS.REGISTER_VERIFY)
                    .send({
                        email: TEST_DATA.validUser.email,
                        otp: '000000' // OTP lụi
                    });
                expect(res.status).toBe(ErrorStatus.AUTH_002);
                expect(res.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
            });


            it('should successfully verify OTP', async () => {
                const otp = await getOtpFromRedis(TEST_DATA.validUser.email)
                expect(otp).toBeDefined();

                const response = await request(app)
                    .post(PATHS.REGISTER_VERIFY)
                    .send({
                        email: TEST_DATA.validUser.email,
                        otp: otp
                    });

                expect(response.status).toBe(201);
            });


            it('Nên chặn đăng ký khi Username đã bị chiếm dụng', async () => {
                const response = await request(app)
                    .post(PATHS.REGISTER_INIT)
                    .send({
                        ...TEST_DATA.validUser,
                        email: 'another@email.com' // Email mới nhưng username cũ
                    });

                expect(response.status).toBe(ErrorStatus.USER_409);
                expect(response.body.code).toBe(ErrorCode.USER.USERNAME_EXISTS);
            });
        });

        describe('🔑 Kịch bản: Đăng nhập hệ thống', () => {

            it('Nên cấp Access Token khi thông tin chính xác', async () => {
                const response = await request(app)
                    .post(PATHS.LOGIN)
                    .send({
                        username: TEST_DATA.validUser.username,
                        password: TEST_DATA.validUser.password
                    });

                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.user.username).toBe(TEST_DATA.validUser.username);
            });

            it('Bảo mật: Phải trả về 404 Username và 401 cho Password', async () => {
                // Case 1: Sai username
                const res1 = await request(app).post(PATHS.LOGIN).send({
                    username: 'non_exist', password: 'any'
                });
                // Case 2: Sai password
                const res2 = await request(app).post(PATHS.LOGIN).send({
                    username: TEST_DATA.validUser.username, password: 'wrong'
                });

                // Cả hai đều phải trả về cùng một mã lỗi để tránh User Enumeration
                expect(res1.status).toBe(ErrorStatus.AUTH_001);
                expect(res2.status).toBe(ErrorStatus.AUTH_001);
                expect(res1.body.code).toBe(ErrorCode.AUTH.INVALID_CREDENTIALS);
                expect(res2.body.code).toBe(ErrorCode.AUTH.INVALID_CREDENTIALS);
            });
        });

        describe('❌ Kịch bản: Kiểm tra lỗi dữ liệu (Validation)', () => {
            const validationCases = [
                { label: 'Email sai định dạng', field: 'email', value: TEST_DATA.invalidEmail, code: ErrorCode.VALIDATION.INVALID_EMAIL },
                { label: 'Mật khẩu quá yếu', field: 'password', value: TEST_DATA.weakPassword, code: ErrorCode.VALIDATION.INVALID_PASSWORD },
            ];

            validationCases.forEach(({ label, field, value, code }) => {
                it(`Nên trả về lỗi khi ${label}`, async () => {
                    const response = await request(app)
                        .post(PATHS.REGISTER_INIT)
                        .send({ ...TEST_DATA.validUser, [field]: value });

                    expect(response.status).toBe(ErrorStatus.USER_003);
                    expect(response.body.code).toBe(code);
                });
            });
        });
    });

    describe('🔑 Kịch bản: Quên mật khẩu (Forgot Password Flow)', () => {


        /**
         * GIAI ĐOẠN 1: YÊU CẦU GỬI OTP
         */
        describe('Step 1: Gửi yêu cầu OTP (Forgot Password Request)', () => {

            it('Nên gửi OTP thành công khi Email tồn tại', async () => {
                await clearResendLock(TEST_DATA.validUser.email);

                const response = await request(app)
                    .post('/api/v1/auth/forgot-password')
                    .send({ email: TEST_DATA.validUser.email });

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject({
                    success: true,
                    code: 'AUTH_OTP_SENT_SUCCESS'
                });
            }, 10000);

            it('Nên báo lỗi khi Email không tồn tại trong hệ thống', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/forgot-password')
                    .send({ email: 'nonexistent@gmail.com' });

                expect(response.body.code).toBe(ErrorCode.USER.NOT_FOUND);
            });

            it('Nên báo lỗi TOO_MANY_REQUESTS khi nhấn gửi lại quá nhanh (Spam)', async () => {
                // Gửi lần 1
                await request(app).post('/api/v1/auth/forgot-password').send({ email: TEST_EMAIL });

                // Gửi lần 2 ngay lập tức
                const response = await request(app)
                    .post('/api/v1/auth/forgot-password')
                    .send({ email: TEST_EMAIL });

                expect(response.body.code).toBe(ErrorCode.SYSTEM.TOO_MANY_REQUESTS);
            });
        });

        /**
         * GIAI ĐOẠN 2: XÁC THỰC OTP VÀ RESET PASSWORD
         */
        describe('Step 2: Xác thực & Đặt lại mật khẩu (Reset Password)', () => {

            it('Nên báo lỗi khi nhập sai mã OTP', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({
                        email: TEST_EMAIL,
                        otp: '000000', // Mã sai
                        newPassword: NEW_PASSWORD
                    });

                expect(response.body.code).toBe(ErrorCode.AUTH.OTP_INVALID);
            });

            it('Nên đặt lại mật khẩu thành công với OTP hợp lệ', async () => {
                // 1. Lấy mã OTP từ Redis (Trong môi trường Test, cậu có quyền truy cập trực tiếp vào Redis để lấy mã)
                const otpCode = await getOtpFromRedis(TEST_DATA.validUser.email)

                const response = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({
                        email: TEST_EMAIL,
                        otp: otpCode,
                        newPassword: NEW_PASSWORD
                    });


                expect(response.status).toBe(200);
                expect(response.body.code).toBe('AUTH_PASSWORD_RESET_SUCCESS');


            });

            it('Nên đăng nhập thành công', async () => {      // 2. Kiểm chứng thêm: Thử login bằng mật khẩu mới phải thành công
                const loginResponse = await request(app)
                    .post('/api/v1/auth/login')
                    .send({ username: TEST_EMAIL, password: NEW_PASSWORD });

                expect(loginResponse.status).toBe(200);
            });

            it('Nên báo lỗi khi mã OTP đã hết hạn hoặc không tồn tại', async () => {
                // Xóa OTP trong Redis để giả lập hết hạn
                await delOTP(TEST_DATA.validUser.email)

                const response = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({
                        email: TEST_EMAIL,
                        otp: '123456',
                        newPassword: NEW_PASSWORD
                    });

                expect(response.body.code).toBe(ErrorCode.AUTH.OTP_EXPIRED);
            });
        });
    });
};