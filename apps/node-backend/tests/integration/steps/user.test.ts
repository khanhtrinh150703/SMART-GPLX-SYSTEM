import request from 'supertest';
import app from '../../../src/app'; // Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import { describe, it, expect, beforeAll } from '@jest/globals';

// 1. Dùng từ khóa 'export' để các file khác có thể import
export const userSteps = () => {
        describe('User Management API', () => {
        let userId: string; // Biến lưu trữ ID động của tài khoản trinh_v1

        // Bước chuẩn bị: Đăng nhập để lấy ID trước khi chạy các test sửa/xóa
        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'trinh_v1',
                    password: 'Password123'
                });

            // Trích xuất ID từ kết quả trả về của hàm login
            // Đảm bảo Mapper của bạn có trả về trường 'id' nhé!
            userId = loginResponse.body.data.user.id;
        });

        // 1. Test API Sửa thông tin cá nhân
        describe('PATCH /api/v1/users/:id/profile', () => {
            it('should update profile successfully with valid data', async () => {
                const response = await request(app)
                    .patch(`/api/v1/users/${userId}/profile`)
                    .send({
                        fullName: 'Trinh Update V2',
                        urlPicture: 'https://example.com/avatar.png'
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.user.fullName).toBe('Trinh Update V2');
                expect(response.body.data.user.urlPicture).toBe('https://example.com/avatar.png');
            });
        });

        // 2. Test API Đổi mật khẩu
        describe('PATCH /api/v1/users/:id/password', () => {
            it('should fail if old password is incorrect', async () => {
                const response = await request(app)
                    .patch(`/api/v1/users/${userId}/password`)
                    .send({
                        oldPassword: 'WrongPassword123!',
                        newPassword: 'NewPassword123!',
                        confirmNewPassword: 'NewPassword123!'
                    });

                expect(response.status).toBe(401); // Hoặc 400 tùy logic mã lỗi INVALID_CREDENTIALS của bạn
                expect(response.body.success).toBe(false);
            });

            it('should fail if new password and confirm password do not match', async () => {
                const response = await request(app)
                    .patch(`/api/v1/users/${userId}/password`)
                    .send({
                        oldPassword: 'Password123', // Mật khẩu cũ đúng
                        newPassword: 'NewPassword123!',
                        confirmNewPassword: 'MismatchPassword123!'
                    });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.code).toBe('VAL_103'); // Mã lỗi CONFIRM_PASSWORD_MISMATCH giả định
            });

            it('should change password successfully', async () => {
                const response = await request(app)
                    .patch(`/api/v1/users/${userId}/password`)
                    .send({
                        oldPassword: 'Password123',
                        newPassword: 'NewPassword123!', // Đổi sang pass mới
                        confirmNewPassword: 'NewPassword123!'
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.message).toBe('Đổi mật khẩu thành công');
            });
        });

        // 3. Test API Đổi trạng thái
        describe('PATCH /api/v1/users/:id/status', () => {
            it('should update user status to BANNED', async () => {
                const response = await request(app)
                    .patch(`/api/v1/users/${userId}/status`)
                    .send({
                        status: 'BANNED' // Thay bằng UserStatus.BANNED nếu dùng biến Enum
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.newStatus).toBe('BANNED');
            });
        });

        // 4. Test API Xóa tài khoản (Phải để cuối cùng)
        describe('DELETE /api/v1/users/:id', () => {
            it('should soft delete the user successfully', async () => {
                const response = await request(app)
                    .delete(`/api/v1/users/${userId}`);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.message).toBe('Xóa tài khoản thành công');
            });

            it('should not allow login after user is deleted', async () => {
                // Cố gắng đăng nhập lại bằng mật khẩu mới vừa đổi ở trên
                const loginResponse = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        username: 'trinh_v1',
                        password: 'NewPassword123!'
                    });

                // Vì hàm findByUserName đã lọc `deletedAt: null`, API login sẽ không tìm thấy user
                // và trả về lỗi INVALID_CREDENTIALS
                expect(loginResponse.status).toBe(401);
                expect(loginResponse.body.success).toBe(false);
                expect(loginResponse.body.code).toBe('AUTH_001');
            });
        });
    });
};