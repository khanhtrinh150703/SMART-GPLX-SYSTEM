import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { redisClient } from '@/infrastructure/database/redis.config';
// import { OtpService } from '@/application/services/otp.service'; // Thêm mới (Newly added)
// import { UserRepository } from '@/infrastructure/repositories/user/user.repository';
// import { RedisOtpRepository } from '@/infrastructure/repositories/redis/redis.repository.otp';
// import { NodemailerService } from '@/application/services/nodemailer.service';
// import { AuthService } from '@/application/services/auth.service';


// const userRepo = new UserRepository();
// const otpRepo = new RedisOtpRepository();
// const emailService = new NodemailerService();
// const otpService = new OtpService(otpRepo, emailService);

// const authService = new AuthService(userRepo, otpService);

export const authSteps = () => {
    describe('Auth API Integration Tests', () => {

        // Data mẫu đồng bộ với hệ thống của bạn
        const testUser = {
            email: 'gplx@dividesk.com',
            username: 'trinh_pro_v1',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            fullName: 'Trinh Cậu Vàng'
        };

        const testUserLG = {
            username: 'trinh_pro_v1',
            password: 'Password123!'
        }

        describe('POST /api/v1/auth/register', () => {

            it('nên gửi OTP thành công khi dữ liệu hợp lệ', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send(testUser);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                const exists = await redisClient.exists(`otp:${testUser.email.toLowerCase()}`);
                expect(exists).toBe(1);
            });

            it('should successfully resennd OTP', async () => {
                await request(app).post('/api/v1/auth/resend-otp').send(testUser);

                const response = await request(app)
                    .post('/api/v1/auth/resend-otp')
                    .send({
                        email: testUser.email,
                    });

                const otpKey = `otp:${testUser.email}`;
                const otp = await redisClient.get(otpKey); // Lấy trực tiếp chuỗi số

                console.log("✅ Mã OTP lấy được:", otp);

                expect(response.status).toBe(200);
            }, 10000);

            it('should successfully verify OTP', async () => {
                await request(app).post('/api/v1/auth/register').send(testUser);

                const otpKey = `otp:${testUser.email}`;
                const otp = await redisClient.get(otpKey); // Lấy trực tiếp chuỗi số

                console.log("✅ Mã OTP lấy được:", otp);

                const response = await request(app)
                    .post('/api/v1/auth/verify')
                    .send({
                        email: testUser.email,
                        otp: otp // Truyền thẳng chuỗi vừa lấy
                    });

                expect(response.status).toBe(200);
            });


            it('should return 409 Conflict when the email is already registered', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send(testUser);

                expect(response.status).toBe(409);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('USER_409'); // ALREADY_EXISTS
            });

            it('should return 400 Bad Request for an invalid email format', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send({
                        email: 'invalid-email-format',
                        username: 'user_invalid_email',
                        password: 'Password123',
                        confirmPassword: 'Password123',
                        fullname: 'Test User'
                    });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('VAL_101'); // INVALID_EMAIL
            });

            it('should return 400 Bad Request for a weak password', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send({
                        email: 'user_weak_pass@test.com',
                        username: 'user_weak_pass',
                        password: '123', // Too short and no letters
                        confirmPassword: '123',
                        fullname: 'Test User'
                    });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('VAL_102'); // INVALID_PASSWORD
            });
            it('should return 400 Bad Request when password and confirm password do not match', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send({
                        email: 'newuser@perfect-travel.ai',
                        username: 'new_user_travel',
                        password: 'StrongPassword123!',
                        confirmPassword: 'DifferentPassword123!', // Cố tình làm sai
                        fullname: 'Test User'
                    });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('VAL_103'); // Giả định mã code cho CONFIRM_PASSWORD_MISMATCH
            });

            it('should return 409 Conflict when the username is already taken', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send({
                        email: 'another.email@test.com', // Email mới chưa từng đăng ký
                        username: 'trinh_pro_v1', // Đã được đăng ký ở test case đầu tiên
                        password: 'Password123',
                        confirmPassword: 'Password123',
                        fullname: 'Trinh Duplicate Username'
                    });

                expect(response.status).toBe(409);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('USER_409'); // ALREADY_EXISTS
            });
        });

        describe('POST /auth/login', () => {
            // Mock data cho case đăng nhập thành công
            // Lưu ý: User 'trinh_v1' với pass 'Password123' PHẢI TỒN TẠI trong Test DB trước khi chạy block này.
            // (Có thể nó đã được tạo ra từ block POST /auth/register chạy ngay trước đó)
            it('should successfully log in with valid credentials', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send(testUserLG);

                console.log(response.body.data)
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.user.username).toBe('trinh_pro_v1');

                // Nếu API có trả về token sau này, hãy expect token ở đây
                // expect(response.body.data.accessToken).toBeDefined();
            });

            it('should return 401 Unauthorized for an invalid username', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        username: 'wrong_username_gplx', // Một username chắc chắn không tồn tại
                        password: 'SecurePassword123!'
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('AUTH_001'); // Mã lỗi chung: INVALID_CREDENTIALS
            });

            it('should return 401 Unauthorized for an invalid password', async () => {
                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        username: 'trinh_pro_v1', // Username đúng
                        password: 'WrongPassword123!' // Mật khẩu sai
                    });

                // QUAN TRỌNG: Mã lỗi phải GIỐNG HỆT case sai username ở trên
                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('AUTH_001'); // Đã sửa lại thành AUTH_001
            });

            // it('should return 403 Forbidden if the account is locked/inactive', async () => {
            //     // LƯU Ý: Để test này pass, bạn cần chèn thêm 1 user có username 'locked_user' 
            //     // và trạng thái là INACTIVE/LOCKED vào Database ở phần beforeAll hoặc ngay trong test này.

            //     const response = await request(app)
            //         .post('/api/v1/auth/login')
            //         .send({
            //             username: 'locked_user',
            //             password: 'ValidPassword123!'
            //         });

            //     expect(response.status).toBe(403);
            //     expect(response.body.success).toBe(false);
            //     expect(response.body.code).toBe('AUTH_403'); // ACCOUNT_LOCKED
            // });
        });
    });

};
