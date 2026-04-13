import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { CHAPTER_ENDPOINTS } from '../../test.data';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { ChapterResponseDTO } from '@/application/dtos/response/chapter/chapter.dto.respone';

/**
 * @param getAdminToken - Hàm callback lấy token Admin
 * @param getRegularToken - Hàm callback lấy token User thường
 */
export const chapterSteps = (
    getAdminToken: () => string, 
    getRegularToken: () => string
) => {

    let testChapterId: string;

    const getAuthHeader = (token: string) => ({
        Authorization: `Bearer ${token}`,
    });

    describe('📂 Chapter Management API Suite', () => {

        // --- KỊCH BẢN: TẠO MỚI ---
        describe('📝 Kịch bản: Tạo mới chương lý thuyết', () => {
            it('✅ Nên tạo thành công khi là Admin và dữ liệu hợp lệ', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    // GỌI HÀM getAdminToken() để lấy giá trị thực tế
                    .set(getAuthHeader(getAdminToken())) 
                    .send({
                        name: 'Khái niệm và quy tắc giao thông',
                        description: 'Các định nghĩa cơ bản và quy tắc ưu tiên đường bộ.',
                        orderIndex: 1
                    });

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.CHAPTER.CREATE_SUCCESS);
            });

            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo chương', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    // GỌI HÀM getRegularToken()
                    .set(getAuthHeader(getRegularToken())) 
                    .send({ name: 'Chương giả mạo' });

                expect(res.status).toBe(403); 
            });
        });

        // --- KỊCH BẢN: TRUY VẤN ---
        describe('🔍 Kịch bản: Lấy danh sách chương', () => {
            it('✅ Nên lấy danh sách thành công và tìm thấy ID chương vừa tạo', async () => {
                const res = await request(app)
                    .get(CHAPTER_ENDPOINTS.FETCH_ALL)
                    // Thường lấy danh sách thì user nào cũng lấy được
                    .set(getAuthHeader(getAdminToken())); 

                expect(res.status).toBe(200);
                
                const data = res.body.data.data as ChapterResponseDTO[];
                const createdItem = data.find((item) => item.name === 'Khái niệm và quy tắc giao thông');

                expect(createdItem).toBeDefined();
                testChapterId = createdItem!.id; 
            });
        });

        // --- KỊCH BẢN: CẬP NHẬT ---
        describe('🔄 Kịch bản: Cập nhật chương lý thuyết', () => {
            it('✅ Nên cập nhật thành công khi là Admin', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId))
                    .set(getAuthHeader(getAdminToken())) // GỌI HÀM getAdminToken()
                    .send({
                        name: '1. Khái niệm và Quy tắc (Updated)',
                        orderIndex: 10
                    });

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.UPDATE_SUCCESS);
            });
        });

        // --- KỊCH BẢN: XÓA & KHÔI PHỤC ---
        describe('🔒 Kịch bản: Xóa mềm và Khôi phục', () => {
            it('✅ Nên xóa mềm thành công chương lý thuyết', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(testChapterId))
                    .set(getAuthHeader(getAdminToken())); // GỌI HÀM getAdminToken()

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.DELETE_SUCCESS);
            });

            it('❌ Nên báo lỗi 404 khi cố gắng xóa lại một chương đã xóa mềm', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(testChapterId))
                    .set(getAuthHeader(getAdminToken())); // GỌI HÀM getAdminToken()

                expect(res.status).toBe(404);
            });

            it('✅ Nên khôi phục (Restore) thành công chương lý thuyết', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.RESTORE(testChapterId))
                    .set(getAuthHeader(getAdminToken())); // GỌI HÀM getAdminToken()

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.RESTORE_SUCCESS);
            });
        });
    });
};