import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { ErrorCode, EXAM_MATRIX_ENDPOINTS, EXAM_MATRIX_PAYLOAD, fakeID } from '../../config/index'

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

            // Định nghĩa dữ liệu chương hợp lệ để tái sử dụng cho các test case thành công
            const getValidChapters = () => [
                { id: getChapterId(), percent: 40, q: 12 },
                { id: getChapterIdSecond(), percent: 35, q: 11 },
                { id: getChapterIdThird(), percent: 25, q: 7 }
            ];

            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(getLicenseId(), getValidChapters());

                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getRegularToken()))
                    .send(payload);

                expect(res.status).toBe(403);
                expect(res.body.success).toBe(false);
            });

            it('✅ Nên tạo thành công khi Admin tạo ma trận hợp lệ', async () => {
                const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(getLicenseId(), getValidChapters());
                const res = await request(app)
                    .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(payload);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data).toBeDefined();
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.licenseCategoryId).toBe(getLicenseId());

                // Lưu lại ID để dùng cho các test case Update/Delete phía sau
                testMatrixId = res.body.data.id;
            });

            describe('📝 Kịch bản: Tạo mới ma trận đề thi', () => {

                describe('🔐 Quyền truy cập & Luồng thành công', () => {
                    it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(getLicenseId(), getValidChapters());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getRegularToken()))
                            .send(payload);

                        expect(res.status).toBe(403);
                        expect(res.body.success).toBe(false);
                    });

                    it('✅ Nên tạo thành công khi Admin gửi dữ liệu hợp lệ', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(getLicenseId(), getValidChapters());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(200);
                        expect(res.body.success).toBe(true);
                        expect(res.body.data.id).toBeDefined();
                        testMatrixId = res.body.data.id; // Lưu lại để dùng cho Update/Delete
                    });
                });

                describe('❌ Lỗi quan hệ dữ liệu (404 Not Found)', () => {
                    it('❌ Nên trả về lỗi khi License Category không tồn tại', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(fakeID, getValidChapters());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(404);
                        expect(res.body.code).toBe(ErrorCode.LICENSE.NOT_FOUND);
                    });

                    it('❌ Nên trả về lỗi khi có Chapter không tồn tại trong DB', async () => {
                        const invalidChapters = () => [{ id: fakeID, percent: 100, q: 30 }];
                        const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(getLicenseId(), invalidChapters());

                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(404);
                        expect(res.body.code).toBe(ErrorCode.CHAPTER.NOT_FOUND);
                    });
                });

                describe('🛠 Lỗi ràng buộc dữ liệu & Logic (400/409)', () => {
                    it('🚫 Nên lỗi khi để trống tên ma trận (MATRIX.NAME_REQUIRED)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.EMPTY_NAME(getLicenseId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_REQUIRED);
                    });

                    it('🚫 Nên lỗi khi tên quá dài > 100 ký tự (MATRIX.NAME_TOO_LONG)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.NAME_TOO_LONG(getLicenseId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_TOO_LONG);
                    });

                    it('🚫 Nên lỗi khi thiếu License ID (VALIDATION.ID_REQUIRED)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.MISSING_LICENSE_ID();
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_REQUIRED);
                    });

                    describe('📝 Kịch bản: Kiểm tra tính hợp lệ của các giá trị số', () => {

                        const numericTestCases = [
                            {
                                label: 'Tổng số câu <= 0',
                                payload: EXAM_MATRIX_PAYLOAD.INVALID_TOTAL_QUESTIONS,
                                expectedCode: ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS
                            },
                            {
                                label: 'Điểm đạt <= 0',
                                payload: EXAM_MATRIX_PAYLOAD.INVALID_PASSING_SCORE,
                                expectedCode: ErrorCode.MATRIX.INVALID_PASSING_SCORE
                            },
                            {
                                label: 'Thời lượng <= 0',
                                payload: EXAM_MATRIX_PAYLOAD.INVALID_DURATION,
                                expectedCode: ErrorCode.MATRIX.INVALID_DURATION
                            },
                        ];

                        it.each(numericTestCases)('🚫 Nên lỗi khi $label', async ({ payload, expectedCode }) => {
                            const res = await request(app)
                                .post(EXAM_MATRIX_ENDPOINTS.BASE)
                                .set(getAuthHeader(getAdminToken()))
                                .send(payload(getLicenseId()));

                            expect(res.status).toBe(400);
                            expect(res.body.code).toBe(expectedCode);
                        });
                    });

                    it('🚫 Nên lỗi khi điểm đạt > tổng câu (MATRIX.INVALID_PASSING_SCORE)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.PASSING_SCORE_TOO_HIGH(getLicenseId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
                    });

                    it('🚫 Nên lỗi khi tổng phần trăm các chương != 100%', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.TOTAL_PERCENT_NOT_100(getLicenseId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PERCENTAGE);
                    });

                    it('🚫 Nên lỗi khi có chương bị trùng lặp (MATRIX.DUPLICATE_CHAPTER)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.DUPLICATE_CHAPTER(getLicenseId(), getChapterId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        // 409 Conflict là mã phù hợp nhất cho dữ liệu trùng lặp
                        expect(res.status).toBe(409);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.DUPLICATE_CHAPTER);
                    });

                    it('🚫 Nên lỗi khi mảng details rỗng (MATRIX.NO_DETAILS)', async () => {
                        const payload = EXAM_MATRIX_PAYLOAD.EMPTY_DETAILS(getLicenseId());
                        const res = await request(app)
                            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
                            .set(getAuthHeader(getAdminToken()))
                            .send(payload);

                        expect(res.status).toBe(400);
                        expect(res.body.code).toBe(ErrorCode.MATRIX.NO_DETAILS);
                    });
                });
            });
        });

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
                expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
            });
        });

        // ====================== CẬP NHẬT MA TRẬN ======================
        describe('📝 Kịch bản: Cập nhật ma trận đề thi', () => {

            describe('📝 Kịch bản: Kiểm tra tính hợp lệ của các giá trị số', () => {

                const numericTestCases = [
                    {
                        label: 'Tổng số câu <= 0',
                        payload: EXAM_MATRIX_PAYLOAD.INVALID_TOTAL_QUESTIONS,
                        expectedCode: ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS
                    },
                    {
                        label: 'Điểm đạt <= 0',
                        payload: EXAM_MATRIX_PAYLOAD.INVALID_PASSING_SCORE,
                        expectedCode: ErrorCode.MATRIX.INVALID_PASSING_SCORE
                    },
                    {
                        label: 'Thời lượng <= 0',
                        payload: EXAM_MATRIX_PAYLOAD.INVALID_DURATION,
                        expectedCode: ErrorCode.MATRIX.INVALID_DURATION
                    },
                ];

                it.each(numericTestCases)('🚫 Nên lỗi khi $label', async ({ payload, expectedCode }) => {
                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload(getLicenseId()));

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(expectedCode);
                });
            });

            const getUpdateChapters = () => [
                { id: getChapterId(), percent: 50, q: 15 },
                { id: getChapterIdSecond(), percent: 50, q: 15 }
            ];

            describe('🔐 Quyền truy cập & Luồng thành công', () => {
                it('🚫 Nên bị từ chối (403) khi User thường cố gắng cập nhật', async () => {
                    const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId)) // testMatrixId lấy từ case Create thành công
                        .set(getAuthHeader(getRegularToken()))
                        .send(payload);

                    expect(res.status).toBe(403);
                });

                it('✅ Nên cập nhật thành công khi Admin gửi dữ liệu hợp lệ', async () => {
                    const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(200);
                    expect(res.body.success).toBe(true);
                    expect(res.body.data.name).toBe(payload.name);
                    expect(res.body.data.totalQuestions).toBe(30);
                });
            });

            describe('❌ Lỗi định danh & Tồn tại (404)', () => {
                it('❌ Nên trả về lỗi 404 khi ID ma trận không tồn tại trong hệ thống', async () => {
                    const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(fakeID)) // ID không tồn tại
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(404);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
                });
            });

            describe('🛠 Lỗi logic nghiệp vụ (Dựa trên isValid)', () => {
                it('🚫 Nên lỗi khi cập nhật tên quá dài > 100 ký tự', async () => {
                    const payload = { ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()), name: 'A'.repeat(101) };

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_TOO_LONG);
                });

                it('🚫 Nên lỗi khi điểm đạt mới cao hơn tổng số câu hỏi mới', async () => {
                    const payload = {
                        ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
                        totalQuestions: 20,
                        passingScore: 25 // 25 > 20
                    };

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
                });

                it('🚫 Nên lỗi khi tổng phần trăm sau khi cập nhật không bằng 100%', async () => {
                    const invalidChapters = [
                        { id: getChapterId(), percent: 30, q: 10 },
                        { id: getChapterIdSecond(), percent: 30, q: 10 } // Tổng 60%
                    ];
                    const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(invalidChapters);

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PERCENTAGE);
                });

                it('🚫 Nên lỗi khi gửi danh sách chương (details) rỗng', async () => {
                    const payload = { ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()), details: [] };

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.NO_DETAILS);
                });

                it('🚫 Nên lỗi khi có giá trị phần trăm chương <= 0', async () => {
                    const payload = {
                        ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
                        details: [{ chapterId: getChapterId(), percentage: 0, numberOfQuestions: 0 }]
                    };

                    const res = await request(app)
                        .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()))
                        .send(payload);

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PERCENTAGE);
                });
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

            describe('🗑️ Kịch bản: Xóa ma trận đề thi', () => {

                it('❌ Nên trả về lỗi 404 khi cố xóa một Exam Matrix ID không tồn tại (Fake ID)', async () => {

                    const res = await request(app)
                        .delete(EXAM_MATRIX_ENDPOINTS.DELETE(fakeID))
                        .set(getAuthHeader(getAdminToken()));

                    expect(res.status).toBe(404);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
                });

                it('❌ Nên trả về lỗi 404 khi cố xóa lại một ma trận đã bị xóa trước đó', async () => {
                    // Lần 1: Xóa thành công (giả định testMatrixId lấy từ bài test tạo mới trước đó)
                    await request(app)
                        .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()));

                    // Lần 2: Cố tình xóa lại chính ID đó
                    const res = await request(app)
                        .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
                        .set(getAuthHeader(getAdminToken()));

                    expect(res.status).toBe(404);
                    expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
                });
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

