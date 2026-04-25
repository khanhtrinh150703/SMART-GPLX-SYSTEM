// src/test/integration/steps/selection.test.ts
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '@/app';
import {
    AUTH_ENDPOINTS,
    CHAPTER_ENDPOINTS,
    ErrorCode, fakeLongToken,
    LICENSE_ENDPOINTS,
    ROLE_ENDPOINTS
} from '../../config/index'

/**
 * @param getAdminToken - Callback lấy token Admin (Mong đợi 200 OK)
 * @param getRegularToken - Callback lấy token User thường (Mong đợi 403 Forbidden)
 */
export const selectionSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string
) => {

    // Helper tạo header linh hoạt theo token truyền vào
    const getAuthHeader = (token: string) => ({
        Authorization: `Bearer ${token}`,
    });

    describe('📂 API: Selection Data (Dropdown)', () => {

        // --- NHÓM TEST CHO ADMIN (200 OK) ---
        describe('✅ Quyền Admin: Truy cập hợp lệ', () => {
            it('Nên lấy danh sách chương học (Chapters) thành công', async () => {
                const res = await request(app)
                    .get(CHAPTER_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                if (res.body.data && res.body.data.length > 0) {
                    expect(res.body.data[0]).toHaveProperty('value');
                    expect(res.body.data[0]).toHaveProperty('label');
                }
            });

            it('Nên lấy danh sách hạng bằng lái (License Categories) thành công', async () => {
                const res = await request(app)
                    .get(LICENSE_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });

            it('Nên lấy danh sách chức vụ (Roles) thành công', async () => {
                const res = await request(app)
                    .get(ROLE_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });
        });

        // --- NHÓM TEST CHO USER THƯỜNG (403 FORBIDDEN) ---
        describe('🚫 Quyền User: Bị từ chối (403 Forbidden)', () => {


            it('❌ Nên trả về 403 khi khi User thường lấy danh sách chức danh', async () => {
                const res = await request(app)
                    .get(ROLE_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getRegularToken()));

                expect(res.status).toBe(403);
            });

            it('Nên trả về 403 khi User thường lấy danh sách chương học', async () => {
                const res = await request(app)
                    .get(CHAPTER_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getRegularToken()));

                expect(res.status).toBe(403);
            });

            it('Nên trả về 403 khi User thường lấy danh sách hạng bằng lái', async () => {
                const res = await request(app)
                    .get(LICENSE_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getRegularToken()));

                expect(res.status).toBe(403);
            });

            it('Nên trả về 403 khi User thường lấy danh sách chức vụ', async () => {
                const res = await request(app)
                    .get(ROLE_ENDPOINTS.SELECTION)
                    .set(getAuthHeader(getRegularToken()));

                expect(res.status).toBe(403);
            });
        });
    });

    describe('🔒 API: Security & Token Validation', () => {

        it('❌ Nên trả về 401 khi truy cập API mà không gửi Token', async () => {
            const res = await request(app)
                .get(ROLE_ENDPOINTS.SELECTION)
            expect(res.status).toBe(401);
        });

        it('❌ Nên trả về 401 khi truy cập API mà không gửi Token', async () => {
            const res = await request(app)
                .get(CHAPTER_ENDPOINTS.SELECTION)
            expect(res.status).toBe(401);
        });

        it('❌ Nên trả về 401 khi truy cập API mà không gửi Token', async () => {
            const res = await request(app)
                .get(LICENSE_ENDPOINTS.SELECTION)
            expect(res.status).toBe(401);
        });

        it('❌ Nên báo lỗi INVALID_TOKEN khi Token Refresh giả mạo', async () => {

            const response = await request(app)
                .post(AUTH_ENDPOINTS.REFRESH_TOKEN)
                .send({ refreshToken: fakeLongToken });

            expect(response.status).toBe(401);
            expect(response.body.code).toBe(ErrorCode.AUTH.INVALID_TOKEN);
        });

    });
};