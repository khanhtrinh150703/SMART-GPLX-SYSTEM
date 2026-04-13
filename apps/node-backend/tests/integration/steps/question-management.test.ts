import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import {
    QUESTION_DATA,
    ErrorCode,
    QUESTION_ENDPOINTS,
} from '../../test.data';
import { attachMultipart } from '@/shared/types/attach.types';

/**
 * @description Bộ suite kiểm thử tích hợp cho quản lý Câu hỏi.
 * Nhận các hàm getter để lấy dữ liệu từ Shared Context của file Main.
 */
export const questionSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string,
    getChapterId: () => string,
    getLicenseId: () => string
) => {
    // Helper để tạo Header nhanh
    const getAuthHeader = (token: string) => ({
        Authorization: `Bearer ${token}`,
    });

    let normalQuestionId: string;
    let criticalQuestionId: string;

    describe('🏗️ Question Management API Suite (Authorized Mode)', () => {

        // ==========================================
        // SCENARIO 1: VALIDATION & AUTHORIZATION
        // ==========================================
        describe('🛡️ Kịch bản: Bắt lỗi Validation & Phân quyền', () => {
            it('🚫 Nên bị từ chối (403) khi User thường cố tình tạo câu hỏi', async () => {
                const res = await request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getRegularToken())) // Gọi hàm lấy token user
                    .send({
                        ...QUESTION_DATA.NORMAL_PAYLOAD,
                        chapterId: getChapterId(), // Gọi hàm lấy chapterId
                        licenseCategoryIds: [getLicenseId()] // Gọi hàm lấy licenseId
                    });

                expect(res.status).toBe(403);
            });

            it('❌ Nên thất bại (QST_001) khi thiếu id chương (Admin thực hiện)', async () => {
                const res = await request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...QUESTION_DATA.NORMAL_PAYLOAD,
                        licenseCategoryIds: [getLicenseId()]
                    });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CHAPTER_REQUIRED);
            });

            it('❌ Nên thất bại (QST_002) khi nội dung quá ngắn', async () => {
                const res = await request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...QUESTION_DATA.INVALID_CONTENT_SHORT,
                        chapterId: getChapterId(),
                        licenseCategoryIds: [getLicenseId()]
                    });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CONTENT_INVALID);
            });

            it('❌ Nên thất bại (QST_003) khi không chọn hạng bằng', async () => {
                const req = request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()));

                const payload = { 
                    ...QUESTION_DATA.MISSING_LICENSE, 
                    chapterId: getChapterId() 
                };

                const res = await attachMultipart(req, payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.LICENSE_REQUIRED);
            });

            it('❌ Nên thất bại (QST_004) khi chỉ có 1 đáp án', async () => {
                const req = request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()));

                const payload = {
                    ...QUESTION_DATA.INSUFFICIENT_ANSWERS,
                    chapterId: getChapterId(),
                    licenseCategoryIds: [getLicenseId()]
                };

                const res = await attachMultipart(req, payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.ANSWERS_INSUFFICIENT);
            });

            it('❌ Nên thất bại (QST_005) khi không có đáp án đúng', async () => {
                const req = request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()));

                const payload = {
                    ...QUESTION_DATA.NO_CORRECT_ANSWER,
                    chapterId: getChapterId(),
                    licenseCategoryIds: [getLicenseId()]
                };

                const res = await attachMultipart(req, payload);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CORRECT_ANSWER_MISSING);
            });
        });

        // ==========================================
        // SCENARIO 2: TẠO THÀNH CÔNG (HAPPY PATH)
        // ==========================================
        describe('📝 Kịch bản: Tạo mới câu hỏi', () => {
            it('✅ Nên tạo thành công câu hỏi BÌNH THƯỜNG', async () => {
                const res = await request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...QUESTION_DATA.NORMAL_PAYLOAD,
                        chapterId: getChapterId(),
                        licenseCategoryIds: [getLicenseId()]
                    });

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                normalQuestionId = res.body.data.id; // Lưu ID để dùng cho các test sau
            });

            it('✅ Nên tạo thành công câu hỏi ĐIỂM LIỆT', async () => {
                const res = await request(app)
                    .post(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...QUESTION_DATA.CRITICAL_PAYLOAD,
                        chapterId: getChapterId(),
                        licenseCategoryIds: [getLicenseId()]
                    });

                expect(res.status).toBe(200);
                criticalQuestionId = res.body.data.id;
            });
        });

        // ==========================================
        // SCENARIO 3: TRUY VẤN (READ)
        // ==========================================
        describe('🔍 Kịch bản: Truy vấn câu hỏi', () => {
            it('✅ Nên lấy danh sách thành công khi là Admin', async () => {
                const res = await request(app)
                    .get(QUESTION_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(Array.isArray(res.body.data.data)).toBe(true);
            });

            it('✅ Nên lấy được chi tiết câu hỏi theo ID (Public/No Auth)', async () => {
                const res = await request(app).get(QUESTION_ENDPOINTS.BY_ID(normalQuestionId));
                expect(res.status).toBe(200);
                expect(res.body.data.id).toBe(normalQuestionId);
            });
        });

        // ==========================================
        // SCENARIO 4: CẬP NHẬT (UPDATE)
        // ==========================================
        describe('🔄 Kịch bản: Cập nhật câu hỏi', () => {
            it('✅ Nên cập nhật thành công nội dung câu hỏi (Admin)', async () => {
                const res = await request(app)
                    .put(QUESTION_ENDPOINTS.BY_ID(normalQuestionId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...QUESTION_DATA.UPDATE_PAYLOAD,
                        chapterId: getChapterId(),
                        licenseCategoryIds: [getLicenseId()]
                    });

                expect(res.status).toBe(200);
                expect(res.body.data.content).toContain("[UPDATED]");
            });
        });

        // ==========================================
        // SCENARIO 5: XÓA VÀ KHÔI PHỤC
        // ==========================================
        describe('🗑️ Kịch bản: Xóa và Khôi phục', () => {
            it('❌ Nên BỊ CHẶN (400) khi Admin cố tình xóa câu hỏi điểm liệt', async () => {
                const res = await request(app)
                    .delete(QUESTION_ENDPOINTS.BY_ID(criticalQuestionId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CANNOT_DELETE_CRITICAL);
            });

            it('✅ Nên xóa mềm thành công câu hỏi bình thường (Admin)', async () => {
                const res = await request(app)
                    .delete(QUESTION_ENDPOINTS.BY_ID(normalQuestionId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);

                // Kiểm tra 404 sau khi xóa mềm
                const getRes = await request(app).get(QUESTION_ENDPOINTS.BY_ID(normalQuestionId));
                expect(getRes.status).toBe(404);
            });

            it('✅ Nên khôi phục thành công câu hỏi (Admin)', async () => {
                const res = await request(app)
                    .patch(QUESTION_ENDPOINTS.RESTORE(normalQuestionId))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });
        });
    });
};