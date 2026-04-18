import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { CHAPTER_ENDPOINTS, CHAPTER_PAYLOAD } from '../../test.data';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { ErrorCode } from '@/shared/errors';
import { ChapterResponseDTO } from '@/application/dtos/response/chapter/chapter.respone.dto';

export const chapterSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string
) => {
    let testChapterId: string;
    const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

    describe('📂 Chapter Management API Suite', () => {

        // --- TẠO MỚI ---
        describe('📝 Kịch bản: Tạo mới chương', () => {
            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    // GỌI HÀM getRegularToken()
                    .set(getAuthHeader(getRegularToken()))
                    .send(CHAPTER_PAYLOAD.CREATE_VALID);
                expect(res.status).toBe(403);
            });
            it('✅ Nên tạo thành công (CHAPTER.CREATE_SUCCESS)', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.CREATE_SUCCESS);
            });

            it('🚫 Check trùng TÊN: Phải trả về CHPT_409', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.DUPLICATE_NAME);

                // Kiểm tra chính xác mã lỗi bạn đã định nghĩa
                expect(res.body.code).toBe(ErrorCode.CHAPTER.NAME_ALREADY_EXISTS);
                expect(res.body.code).toBe('CHPT_409');
            });

            it('🚫 Check trùng MÃ (Code): Phải trả về CHPT_410', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.DUPLICATE_CODE);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.CODE_ALREADY_EXISTS);
                expect(res.body.code).toBe('CHPT_410');
            });

            it('🚫 Check thứ tự âm: Phải trả về CHPT_003', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.INVALID_ORDER);

                expect(res.body.code).toBe(ErrorCode.CHAPTER.INVALID_ORDER);
                expect(res.body.code).toBe('CHPT_003');
            });
            it('🚫 Check mô tả rỗng: Phải trả về CHPT_004', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(CHAPTER_PAYLOAD.INVALID_DESCRIPTION);

                // Kiểm tra mã lỗi theo hằng số và chuỗi định danh CHPT_004
                expect(res.body.code).toBe(ErrorCode.CHAPTER.INVALID_DESCRIPTION);
                expect(res.body.code).toBe('CHPT_004');

                // Nếu bạn muốn check luôn cả message tiếng Việt cho "lì"
                expect(res.body.message).toBe('Mô tả chương không được để trống hoặc chỉ chứa khoảng trắng.');
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

        // --- CẬP NHẬT & XÓA ---
        describe('🔄 Kịch bản: Cập nhật & Xóa', () => {
            it('✅ Cập nhật thành công (UPDATE_SUCCESS)', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken()))

                expect(res.body.message).toBe(Message.CHAPTER.UPDATE_SUCCESS);
            });

            it('🚫 Cập nhật chương không tồn tại: Phải trả về CHPT_404', async () => {
                const fakeId = '00000000-0000-0000-0000-000000000000';
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(fakeId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ name: 'Ghost' });

                expect(res.body.code).toBe(ErrorCode.CHAPTER.NOT_FOUND);
                expect(res.body.code).toBe('CHPT_404');
            });
        });
    });
};