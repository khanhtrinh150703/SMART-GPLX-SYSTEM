import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '@/app';
import {
    QUESTION_DATA,
    ErrorCode,
    QUESTION_ENDPOINTS,
    LICENSE_ENDPOINTS,
    CHAPTER_ENDPOINTS,
} from '../../test.data'

export const questionSteps = () => {
    let normalQuestionId: string;
    let criticalQuestionId: string;
    let chapterId: string;
    let licenseId: string;

    beforeAll(async () => {
        const chapterRes = await request(app).get(CHAPTER_ENDPOINTS.BASE);
        chapterId = chapterRes.body.data?.[0]?.id;

        const licenseRes = await request(app).get(LICENSE_ENDPOINTS.BASE);
        licenseId = licenseRes.body.data?.[0]?.id;

        if (!chapterId || !licenseId) {
            throw new Error("⚠️ Database trống! Hãy Seed data Chapter và License trước.");
        }
    });

    describe('🏗️ Question Management API Suite (No Auth Mode)', () => {

        // ==========================================
        // SCENARIO 1: VALIDATION KHI TẠO MỚI
        // ==========================================
        describe('🛡️ Kịch bản: Bắt lỗi Validation', () => {
            it('Nên thất bại (QST_001) khi thiếu id chương', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.INVALID_CONTENT_SHORT,
                    licenseCategoryIds: [licenseId]
                });
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CHAPTER_REQUIRED);
            });
            it('Nên thất bại (QST_002) khi nội dung quá ngắn', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.INVALID_CONTENT_SHORT,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CONTENT_INVALID);
            });

            it('Nên thất bại (QST_003) khi không chọn hạng bằng', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.MISSING_LICENSE,
                    chapterId
                    // Cố tình không truyền licenseCategoryIds hợp lệ
                });
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.LICENSE_REQUIRED);
            });

            it('Nên thất bại (QST_004) khi chỉ có 1 đáp án', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.INSUFFICIENT_ANSWERS,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.ANSWERS_INSUFFICIENT);
            });

            it('Nên thất bại (QST_005) khi không có đáp án đúng', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.NO_CORRECT_ANSWER,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CORRECT_ANSWER_MISSING);
            });
        });

        // ==========================================
        // SCENARIO 2: TẠO THÀNH CÔNG (HAPPY PATH)
        // ==========================================
        describe('📝 Kịch bản: Tạo mới câu hỏi', () => {
            it('Nên tạo thành công câu hỏi BÌNH THƯỜNG', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.NORMAL_PAYLOAD,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });

                expect(res.status).toBe(200); // (Hoặc 200 tùy code backend của bạn)
                expect(res.body.success).toBe(true);
                normalQuestionId = res.body.data.id;
            });

            it('Nên tạo thành công câu hỏi ĐIỂM LIỆT', async () => {
                const res = await request(app).post(QUESTION_ENDPOINTS.BASE).send({
                    ...QUESTION_DATA.CRITICAL_PAYLOAD,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });

                expect(res.status).toBe(200);
                criticalQuestionId = res.body.data.id;
            });
        });

        // ==========================================
        // SCENARIO 3: CẬP NHẬT (UPDATE)
        // ==========================================
        describe('🔄 Kịch bản: Cập nhật câu hỏi', () => {
            it('Nên cập nhật không thành công thì câu hỏi không hợp lệ', async () => {
                const res = await request(app).put(QUESTION_ENDPOINTS.BY_ID(normalQuestionId)).send({
                    ...QUESTION_DATA.INSUFFICIENT_ANSWERS,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });

                expect(res.status).toBe(400);
            });
            it('Nên cập nhật thành công câu hỏi bình thường', async () => {
                const res = await request(app).put(QUESTION_ENDPOINTS.BY_ID(normalQuestionId)).send({
                    ...QUESTION_DATA.UPDATE_PAYLOAD,
                    chapterId,
                    licenseCategoryIds: [licenseId]
                });

                expect(res.status).toBe(200);
                expect(res.body.data.content).toContain("[UPDATED]");
                // Đảm bảo không biến nó thành điểm liệt để lát còn xóa
                expect(res.body.data.isCritical).toBe(false);
            });
        });

        // ==========================================
        // SCENARIO 4: XÓA VÀ KHÔI PHỤC
        // ==========================================
        describe('🗑️ Kịch bản: Xóa và Khôi phục', () => {
            it('Nên BỊ CHẶN (400) khi cố tình xóa câu hỏi điểm liệt', async () => {
                const res = await request(app).delete(QUESTION_ENDPOINTS.BY_ID(criticalQuestionId));
                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.QUESTION.CANNOT_DELETE_CRITICAL);
            });

            it('Nên xóa mềm thành công câu hỏi bình thường', async () => {
                const res = await request(app).delete(QUESTION_ENDPOINTS.BY_ID(normalQuestionId));
                expect(res.status).toBe(200);

                const getRes = await request(app).get(QUESTION_ENDPOINTS.BY_ID(normalQuestionId));
                expect(getRes.status).toBe(404);
            });

            it('Nên khôi phục thành công câu hỏi bình thường đã xóa', async () => {
                const res = await request(app).patch(QUESTION_ENDPOINTS.RESTORE(normalQuestionId));
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });
        });
    });
};