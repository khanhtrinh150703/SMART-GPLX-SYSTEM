import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { EXAM_MATRIX_ENDPOINTS, EXAM_MATRIX_PAYLOAD } from '../../test.data';

export const examMatrixSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string,
    getLicenseId: () => string,
    getChapterId: () => string,        // Chapter 1
    getChapterIdSecond: () => string,  // Chapter 2
    getChapterIdThird: () => string    // Chapter 3
) => {
    let testMatrixId: string;

    const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

    describe('📂 Exam Matrix Management API Suite', () => {

        // ====================== TẠO MỚI MA TRẬN ======================
        describe('📝 Kịch bản: Tạo mới ma trận đề thi', () => {

            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
                    getLicenseId(),
                    getChapterId(),
                    getChapterIdSecond(),
                    getChapterIdThird()
                );

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getRegularToken()))
                    .send(payload);

                expect(res.status).toBe(403);
                expect(res.body.success).toBe(false);
            });

            it('✅ Nên tạo thành công khi Admin tạo ma trận hợp lệ (3 chương)', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
                    getLicenseId(),
                    getChapterId(),
                    getChapterIdSecond(),
                    getChapterIdThird()
                );

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data).toBeDefined();
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.licenseCategoryId).toBe(getLicenseId());

                testMatrixId = res.body.data.id;
            });

            it('🚫 Nên trả về lỗi khi tổng phần trăm không bằng 100%', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_INVALID_PERCENTAGE(
                    getLicenseId(),
                    getChapterId(),
                    getChapterIdSecond()
                );

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe('INVALID_MATRIX_PERCENTAGE');
            });

            it('🚫 Nên trả về lỗi khi có chương trùng lặp', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_DUPLICATE_CHAPTER(
                    getLicenseId(),
                    getChapterId()
                );

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(409);
                expect(res.body.code).toBe('DUPLICATE_CHAPTER_IN_MATRIX');
            });

            it('🚫 Nên trả về lỗi khi thiếu chi tiết chương', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_NO_DETAILS(getLicenseId());

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe('MATRIX_NO_DETAILS');
            });
        });

        // ====================== LẤY THÔNG TIN MA TRẬN ======================
        describe('🔍 Kịch bản: Lấy thông tin ma trận', () => {

            it('✅ Admin lấy chi tiết ma trận theo ID thành công', async () => {
                if (!testMatrixId) {
                    console.warn('⚠️ testMatrixId chưa được tạo, bỏ qua test này');
                    return;
                }

                const res = await request(app)
                    .get(EXAM_MATRIX_ENDPOINTS.GET_BY_ID(testMatrixId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.id).toBe(testMatrixId);
            });

            it('🚫 Nên trả về 404 khi lấy ma trận không tồn tại', async () => {
                const fakeId = '00000000-0000-0000-0000-000000000000';

                const res = await request(app)
                    .get(EXAM_MATRIX_ENDPOINTS.GET_BY_ID(fakeId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(404);
                expect(res.body.code).toBe('MATRIX_NOT_FOUND');
            });
        });

        // ====================== CẬP NHẬT MA TRẬN ======================
        describe('✏️ Kịch bản: Cập nhật ma trận', () => {

            it('✅ Admin cập nhật ma trận thành công', async () => {
                if (!testMatrixId) {
                    console.warn('⚠️ testMatrixId chưa được tạo, bỏ qua test này');
                    return;
                }

                const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(
                    getChapterId(),
                    getChapterIdSecond(),
                    getChapterIdThird()
                );

                const res = await request(app)
                    .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.id).toBe(testMatrixId);
            });

            it('🚫 Nên trả về lỗi khi tổng % sau cập nhật không bằng 100', async () => {
                if (!testMatrixId) return;

                const payload = EXAM_MATRIX_PAYLOAD.UPDATE_INVALID_PERCENTAGE(
                    getChapterId(),
                    getChapterIdSecond()
                );

                const res = await request(app)
                    .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe('INVALID_MATRIX_PERCENTAGE');
            });
        });

        // ====================== XÓA MA TRẬN ======================
        describe('🗑️ Kịch bản: Xóa ma trận', () => {

            it('✅ Admin xóa ma trận thành công (smart delete)', async () => {
                if (!testMatrixId) return;

                const res = await request(app)
                    .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });
        });

        // // ====================== KHÔI PHỤC MA TRẬN ======================
        // describe('♻️ Kịch bản: Khôi phục ma trận', () => {

        //     it('✅ Admin khôi phục ma trận đã xóa mềm thành công', async () => {
        //         if (!testMatrixId) return;

        //         const res = await request(app)
        //             .patch(EXAM_MATRIX_ENDPOINTS.RESTORE(testMatrixId))
        //             .set(getAuthHeader(getAdminToken()));

        //         expect(res.status).toBe(200);
        //         expect(res.body.success).toBe(true);
        //     });

        //     it('🚫 Nên trả về lỗi khi khôi phục gây trùng lặp ma trận hoạt động', async () => {
        //         if (!testMatrixId) return;

        //         const res = await request(app)
        //             .patch(EXAM_MATRIX_ENDPOINTS.RESTORE(testMatrixId))
        //             .set(getAuthHeader(getAdminToken()));

        //         expect(res.status).toBe(400);
        //         expect(res.body.code).toBe('MATRIX_RESTORE_FAILED_DUPLICATE');
        //     });
        // });
    });
};