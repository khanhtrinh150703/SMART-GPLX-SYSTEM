import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { CHAPTER_ENDPOINTS, CHAPTER_PAYLOAD, fakeID } from '../../config/index'
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { ErrorCode } from '@/shared/errors';
import { ChapterResponseDTO } from '@/application/dtos/response/chapter/chapter.respone.dto';
import { DeleteType } from '@/domain/constants/delete.constant';

export const chapterSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string,
    getChapterId: () => string,
    getChapterIdSecond: () => string,
) => {
    let testChapterId: string;
    const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

    describe('📂 Chapter Management API Suite', () => {

        // --- TẠO MỚI ---
        describe('📝 Kịch bản: Tạo mới chương (Create Chapter)', () => {

            // --- NHÓM 1: PHÂN QUYỀN (AUTHORIZATION) ---
            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getRegularToken()))
                    .send(CHAPTER_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(403);
            });

            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)

                expect(res.status).toBe(401); // Unauthorized
            });

            // --- NHÓM 2: TRƯỜNG HỢP THÀNH CÔNG ---
            it('✅ Nên tạo thành công với đầy đủ thông tin (200)', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.CREATE_SUCCESS);
            });

            it('✅ Nên tạo thành công với dữ liệu tối thiểu (Minimal)', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.MINIMAL_VALID);

                expect(res.status).toBe(200);
            });

            // --- NHÓM 3: LỖI VALIDATION (DỮ LIỆU ĐẦU VÀO) ---
            it('🚫 Check TÊN trống: Trả về VALIDATION.NAME_REQUIRED', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.MISSING_NAME);

                expect(res.body.code).toBe(ErrorCode.VALIDATION.NAME_REQUIRED);
            });

            it('🚫 Check MÃ (Code) trống: Trả về VALIDATION.CODE_REQUIRED', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.MISSING_CODE);

                expect(res.body.code).toBe(ErrorCode.VALIDATION.CODE_REQUIRED);
            });

            it('🚫 Check thứ tự âm: Trả về CHPT_003', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.INVALID_ORDER);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.INVALID_ORDER); // 'CHPT_003'
            });

            it('🚫 Check mô tả quá dài (>500 ký tự): Trả về DESCRIPTION_TOO_LONG', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.DESCRIPTION_TOO_LONG);

                expect(res.body.code).toBe(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
            });

            it('🚫 Check mô tả rỗng: Phải trả về CHPT_004', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.INVALID_DESCRIPTION);

                expect(res.body.code).toBe(ErrorCode.VALIDATION.DESCRIPTION_REQUIRED); // 'CHPT_004'
            });

            // --- NHÓM 4: LỖI NGHIỆP VỤ (BUSINESS LOGIC / DUPLICATE) ---
            it('🚫 Check trùng TÊN: Phải trả về CHPT_409', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.DUPLICATE_NAME);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.NAME_ALREADY_EXISTS); // 'CHPT_409'
            });

            it('🚫 Check trùng MÃ (Code): Phải trả về CHPT_410', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.DUPLICATE_CODE);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.CODE_ALREADY_EXISTS); // 'CHPT_410'
            });
        });

        // --- TRUY VẤN ---
        describe('🔍 Kịch bản: Truy vấn', () => {
            it('✅ Nên tìm thấy chương theo mã code vừa tạo', async () => {
                const res = await request(app)
                    .get(CHAPTER_ENDPOINTS.FETCH_ALL)
                    .set(getAuthHeader(getAdminToken()));

                const data = res.body.data.data as ChapterResponseDTO[];
                const createdItem = data.find(i => i.code === CHAPTER_PAYLOAD.CREATE_VALID.code);

                expect(createdItem).toBeDefined();
                testChapterId = createdItem!.id;
            });
        });

        // --- CẬP NHẬT ---
        describe('🔄 Kịch bản: Cập nhật Chương (Update Chapter)', () => {

            // --- PHÂN QUYỀN ---
            it('🚫 Nên bị từ chối (403) khi User thường cố gắng cập nhật', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getRegularToken()))
                    .send(CHAPTER_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(403);
            });


            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))

                expect(res.status).toBe(401); // Unauthorized
            });

            // --- TRƯỜNG HỢP THÀNH CÔNG ---
            it('✅ Cập nhật thành công (UPDATE_SUCCESS)', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.UPDATE_SUCCESS);
            });

            // --- LỖI TÌM KIẾM & ĐỊNH DANH (ID) ---
            it('🚫 Cập nhật chương không tồn tại: Phải trả về CHPT_404', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(fakeID))
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.MISSING_ID);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.NOT_FOUND); // 'CHPT_404'
            });

            it('🚫 Lỗi khi không truyền ID: Phải trả về(404)', async () => {
                // Giả sử Endpoint không có ID hoặc truyền ID null/undefined
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.BASE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(404);
            });

            // --- LỖI VALIDATION DỮ LIỆU ĐẦU VÀO ---
            it('🚫 Check TÊN trống khi cập nhật: Phải trả về NAME_REQUIRED', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...CHAPTER_PAYLOAD.UPDATE_VALID, name: '' });

                expect(res.body.code).toBe(ErrorCode.VALIDATION.NAME_REQUIRED);
            });

            it('🚫 Check MÔ TẢ quá dài: Phải trả về DESCRIPTION_TOO_LONG', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({
                        ...CHAPTER_PAYLOAD.UPDATE_VALID,
                        description: 'A'.repeat(501)
                    });

                expect(res.body.code).toBe(ErrorCode.VALIDATION.DESCRIPTION_TOO_LONG);
            });

            it('🚫 Check THỨ TỰ âm: Phải trả về INVALID_ORDER', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...CHAPTER_PAYLOAD.UPDATE_VALID, orderIndex: -5 });

                expect(res.body.code).toBe(ErrorCode.CHAPTER.INVALID_ORDER);
            });

            // --- LỖI XUNG ĐỘT DỮ LIỆU (DUPLICATE) ---
            it('🚫 Check trùng MÃ (Code) với chương khác: Phải trả về CODE_ALREADY_EXISTS', async () => {
                // Giả sử mã 'GPLX_CH1' đã tồn tại ở một chương khác
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...CHAPTER_PAYLOAD.UPDATE_VALID, code: 'GPLX_CH1' });

                expect(res.body.code).toBe(ErrorCode.CHAPTER.CODE_ALREADY_EXISTS);
            });
        });

        describe('🔒 Kịch bản: Xóa mềm và Khôi phục Chapter (Unlock)', () => {

            it('Nên từ chối (403) khi User thường cố gắng  Xóa ', async () => {
                const response = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterId()))
                    .set(getAuthHeader(getRegularToken()));

                expect(response.status).toBe(403); // Forbidden
                expect(response.body.success).toBe(false);
            });

            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterId()))
                expect(res.status).toBe(401); // Unauthorized
            });

            it('✅ Nên xóa mềm thành công chương học', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterId()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.DELETE_SUCCESS);
            });

            it('✅ Nên xóa cứng thành công ', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterIdSecond()))
                    .set(getAuthHeader(getAdminToken()));
                expect(res.status).toBe(200);
                expect(res.body.data).toEqual({ type: DeleteType.HARD });
                expect(res.body.message).toBe(Message.CHAPTER.DELETE_SUCCESS);
            });

            it('❌ Nên trả về lỗi 404 khi cố xóa một Chapter ID không tồn tại hoặc đã bị xóa', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterIdSecond()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(404);
            });

            it('❌ Nên trả về lỗi 404 khi cố xóa một Chapter ID không tồn tại hoặc đã bị xóa', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(getChapterId()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(404);
            });

            it('Nên từ chối (403) khi User thường cố gắng khôi phục ', async () => {
                const response = await request(app)
                    .patch(CHAPTER_ENDPOINTS.RESTORE(getChapterId()))
                    .set(getAuthHeader(getRegularToken()))
                    .send();


                expect(response.status).toBe(403); // Forbidden
                expect(response.body.success).toBe(false);
            });

            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.RESTORE(getChapterId())) // Đổi sang RESTORE của CHAPTER

                expect(res.status).toBe(401); // Unauthorized
            });

            it('✅ Nên khôi phục (Restore) thành công chương học đã xóa', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.RESTORE(getChapterId()))
                    .set(getAuthHeader(getAdminToken()))
                    .send();

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.CHAPTER.RESTORE_SUCCESS); // Đổi sang Message.CHAPTER
            });
        });
    });
};