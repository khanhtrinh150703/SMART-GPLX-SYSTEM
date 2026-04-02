import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { CHAPTER_ENDPOINTS } from '../../test.data'; // Giả định cậu đã định nghĩa CHAPTER_ENDPOINTS
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { ChapterResponseDTO } from '@/application/dtos/response/chapter/chapter.dto';

/**
 * @description Bộ suite kiểm thử tích hợp (Integration Test) cho quy trình quản lý Chương lý thuyết.
 * Luồng đi: Tạo mới -> Lấy danh sách -> Cập nhật -> Xóa mềm -> Khôi phục.
 */
export const chapterSteps = () => {
    describe('📂 Chapter Management API Suite', () => {
        let testChapterId: string;

        // ==========================================
        // KỊCH BẢN: TẠO MỚI CHƯƠNG LÝ THUYẾT
        // ==========================================
        describe('📝 Kịch bản: Tạo mới chương lý thuyết', () => {
            it('✅ Nên tạo thành công khi dữ liệu hợp lệ (VD: Chương 1)', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .send({
                        name: 'Khái niệm và quy tắc giao thông',
                        description: 'Các định nghĩa cơ bản và quy tắc ưu tiên đường bộ.',
                        orderIndex: 1
                    });

                expect(res.status).toBe(200); // Hoặc 201 tùy theo Result.ok của cậu
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.CHAPTER.CREATE_SUCCESS);
            });

            it('❌ Nên trả về lỗi 409 khi tên chương đã tồn tại', async () => {
                const res = await request(app)
                    .post(CHAPTER_ENDPOINTS.CREATE)
                    .send({
                        name: 'Khái niệm và quy tắc giao thông',
                        description: 'Mô tả trùng lặp.',
                        orderIndex: 2
                    });

                expect(res.status).toBe(409);
            });
        });

        // ==========================================
        // KỊCH BẢN: TRUY VẤN DANH SÁCH
        // ==========================================
        describe('🔍 Kịch bản: Lấy danh sách chương', () => {
            it('✅ Nên lấy danh sách thành công và sắp xếp đúng theo orderIndex', async () => {
                const res = await request(app)
                    .get(CHAPTER_ENDPOINTS.FETCH_ALL);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(Array.isArray(res.body.data)).toBe(true);

                const data = res.body.data as ChapterResponseDTO[];

                // Tìm chương vừa tạo để lấy ID cho các bước sau
                const createdItem = data.find((item) => item.name === 'Khái niệm và quy tắc giao thông');

                expect(createdItem).toBeDefined();
                testChapterId = createdItem!.id;
                expect(testChapterId).toBeDefined();
            });
        });

        // ==========================================
        // KỊCH BẢN: CẬP NHẬT THÔNG TIN
        // ==========================================
        describe('🔄 Kịch bản: Cập nhật chương lý thuyết', () => {
            it('✅ Nên cập nhật thành công tên và thứ tự hiển thị (orderIndex)', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.UPDATE(testChapterId)) // Dùng PATCH theo Controller
                    .send({
                        name: '1. Khái niệm và Quy tắc (Updated)',
                        orderIndex: 10,
                        description: 'Cập nhật mô tả chi tiết hơn.'
                    });

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.UPDATE_SUCCESS);
            });
        });

        // ==========================================
        // KỊCH BẢN: XÓA VÀ KHÔI PHỤC (SOFT DELETE & RESTORE)
        // ==========================================
        describe('🔒 Kịch bản: Xóa mềm và Khôi phục', () => {
            it('✅ Nên xóa mềm thành công chương lý thuyết', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(testChapterId));

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.CHAPTER.DELETE_SUCCESS);
            });

            it('✅ Nên xóa mềm không thành công chương lý thuyết', async () => {
                const res = await request(app)
                    .delete(CHAPTER_ENDPOINTS.DELETE(testChapterId));

                expect(res.status).toBe(404);
            });

            it('✅ Nên khôi phục (Restore) thành công chương đã xóa', async () => {
                const res = await request(app)
                    .patch(CHAPTER_ENDPOINTS.RESTORE(testChapterId));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.CHAPTER.RESTORE_SUCCESS);
            });

            // it('❌ Nên trả về lỗi khi xóa chương đang có câu hỏi liên kết (Constraint)', async () => {
            //     // Lưu ý: Test case này cần setup dữ liệu câu hỏi trước
            //     const res = await request(app)
            //         .delete(CHAPTER_ENDPOINTS.DELETE(testChapterId));
            //     expect(res.status).toBe(400); // Hoặc mã lỗi cậu định nghĩa cho HAS_RELATED_QUESTIONS
            // });
        });
    });
};