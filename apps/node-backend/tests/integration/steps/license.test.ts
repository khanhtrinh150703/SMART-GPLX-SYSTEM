import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { LICENSE_ENDPOINTS } from '../../config/index'
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { LicenseCategoryResponse } from '@/application/dtos/response/license-category/license-category.respone.dto';
import { LICENSE_PAYLOAD } from '../../config/index'
import { DeleteType } from '@/domain/constants/delete.constant';

// Helper để tạo Header Auth nhanh
const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

/**
 * @param getAdminToken - Hàm callback để lấy token Admin tại thời điểm thực thi test
 */
export const licenseSteps = (
    getAdminToken: () => string,
    getRegularToken: () => string,
    getLicenseId: () => string,
    getLicenseIdSecond: () => string,
) => {
    describe('📂 License Category Management API Suite', () => {
        let testCategoryId: string;

        // Tự động lấy token mỗi khi cần sử dụng
        // Việc gọi hàm getAdminToken() đảm bảo token đã được gán giá trị từ beforeAll ở file Main

        describe('📝 Kịch bản: Tạo mới hạng bằng lái', () => {
            it('✅ Nên tạo thành công khi dữ liệu hợp lệ (VD: Hạng B2)', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken())) // GỌI HÀM Ở ĐÂY
                    .send(LICENSE_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.LICENSE.CREATE_SUCCESS);
            });

            it('❌ Nên trả về lỗi 409 khi tên hạng bằng đã tồn tại', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken())) // GỌI HÀM Ở ĐÂY
                    .send({
                        name: 'B2',
                        description: 'Mô tả trùng lặp.'
                    });

                expect(res.status).toBe(409);
            });
        });

        describe('🔍 Kịch bản: Lấy danh sách hạng bằng', () => {
            it('✅ Nên lấy danh sách thành công và chứa hạng bằng vừa tạo', async () => {
                const res = await request(app)
                    .get(LICENSE_ENDPOINTS.FETCH_ALL)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);

                const data = res.body.data.data as LicenseCategoryResponse[];
                const createdItem = data.find((item) => item.name === 'B2');

                expect(createdItem).toBeDefined();
                testCategoryId = createdItem!.id;
            });
            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo bằng', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    // GỌI HÀM getRegularToken()
                    .set(getAuthHeader(getRegularToken()))
                    .send(LICENSE_PAYLOAD.INVALID_NAME);

                expect(res.status).toBe(403);
            });
        });

        describe('🔄 Kịch bản: Cập nhật hạng bằng lái', () => {
            it('✅ Nên cập nhật thành công khi thay đổi mô tả', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken())) // GỌI HÀM Ở ĐÂY
                    .send(LICENSE_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.UPDATE_SUCCESS);
            });
        });

        describe('🔒 Kịch bản: Xóa mềm và Khôi phục (Unlock)', () => {
            it('✅ Nên xóa mềm thành công ', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseId()))
                    .set(getAuthHeader(getAdminToken()));
                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.DELETE_SUCCESS);
            });

            it('✅ Nên xóa cứng thành công ', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseIdSecond()))
                    .set(getAuthHeader(getAdminToken()));
                expect(res.status).toBe(200);
                expect(res.body.data).toEqual({ type: DeleteType.HARD });
                expect(res.body.message).toBe(Message.LICENSE.DELETE_SUCCESS);
            });


            it('❌ Nên trả về lỗi 404 khi cố xóa một ID không tồn tại hoặc đã bị xóa', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseIdSecond()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(404);
            });

            it('❌ Nên trả về lỗi 404 khi cố xóa một ID không tồn tại hoặc đã bị xóa', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseId()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(404);
            });

            it('✅ Nên khôi phục (Restore) thành công hạng bằng đã xóa', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.RESTORE(getLicenseId()))
                    .set(getAuthHeader(getAdminToken()))
                    .send();

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.LICENSE.RESTORE_SUCCESS);
            });
        });
    });
};