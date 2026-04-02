import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { LICENSE_ENDPOINTS } from '../../test.data'; // Đảm bảo đường dẫn import đúng
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { LicenseCategoryResponse } from '@/application/dtos/response/license-category/res-license-category.dto';

// Giả định helper cho Auth
// const getAuthHeader = () => ({ Authorization: `Bearer test-admin-token` });


export const licenseSteps = () => {
    describe('📂 License Category Management API Suite', () => {
        let testCategoryId: string;

        // ==========================================
        // KỊCH BẢN: TẠO MỚI HẠNG BẰNG LÁI
        // ==========================================
        describe('📝 Kịch bản: Tạo mới hạng bằng lái', () => {
            it('✅ Nên tạo thành công khi dữ liệu hợp lệ (VD: Hạng B2)', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE) // Sử dụng .CREATE (là API_BASE.LICENSE)
                    .send({
                        name: 'B2',
                        description: 'Hạng bằng lái xe ô tô chở người đến 9 chỗ.'
                    });

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                // Kiểm tra code và message từ file hằng số
                expect(res.body.message).toBe(Message.LICENSE.CREATE_SUCCESS);
            });

            it('❌ Nên trả về lỗi 409 khi tên hạng bằng đã tồn tại', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .send({
                        name: 'B2',
                        description: 'Mô tả trùng lặp.'
                    });

                expect(res.status).toBe(409);
            });
        });

        // ==========================================
        // KỊCH BẢN: TRUY VẤN DANH SÁCH
        // ==========================================
        describe('🔍 Kịch bản: Lấy danh sách hạng bằng', () => {
            it('✅ Nên lấy danh sách thành công và chứa hạng bằng vừa tạo', async () => {
                const res = await request(app)
                    .get(LICENSE_ENDPOINTS.FETCH_ALL);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(Array.isArray(res.body.data)).toBe(true);
                const data = res.body.data as LicenseCategoryResponse[];

                const createdItem = data.find((item) => item.name === 'B2');

                testCategoryId = createdItem!.id;
                expect(testCategoryId).toBeDefined();
            });
        });

        // ==========================================
        // KỊCH BẢN: CẬP NHẬT THÔNG TIN
        // ==========================================
        describe('🔄 Kịch bản: Cập nhật hạng bằng lái', () => {
            it('✅ Nên cập nhật thành công khi thay đổi mô tả', async () => {
                // Gọi hàm .UPDATE(id) thay vì cộng chuỗi
                const res = await request(app)
                    .put(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .send({
                        name: 'B2',
                        description: 'Mô tả đã được chỉnh sửa chuẩn xác hơn.'
                    });

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.UPDATE_SUCCESS);
            });
        });

        // ==========================================
        // KỊCH BẢN: XÓA VÀ KHÔI PHỤC (SOFT DELETE & RESTORE)
        // ==========================================
        describe('🔒 Kịch bản: Xóa mềm và Khôi phục (Unlock)', () => {
            it('✅ Nên xóa mềm thành công (deleted_at != null)', async () => {
                // Gọi hàm .DELETE(id)
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(testCategoryId));

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.DELETE_SUCCESS);
            });

            // it('❌ Nên trả về lỗi 403 khi xóa hạng bằng đang có dữ liệu liên quan (Constraint)', async () => {
            //     const res = await request(app)
            //         .delete(LICENSE_ENDPOINTS.DELETE('used-id-constant'))
            //         .set(getAuthHeader());

            //     expect(res.status).toBe(403);
            // });

            it('✅ Nên khôi phục (Restore) thành công hạng bằng đã xóa', async () => {
                // Gọi hàm .RESTORE(id)
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.RESTORE(testCategoryId));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                // Đảm bảo Message.LICENSE.RESTORE_SUCCESS đã được định nghĩa trong file vn.ts
                expect(res.body.message).toBe(Message.LICENSE.RESTORE_SUCCESS);
            });
        });
    });
}
