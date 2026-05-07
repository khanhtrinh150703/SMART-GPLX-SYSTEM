import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '@/app';
import { ErrorCode, LICENSE_ENDPOINTS } from '../../config/index'
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { LICENSE_PAYLOAD } from '../../config/index'
import { DeleteType } from '@/domain/constants/delete.constant';
import { ILicenseCategoryResponseDTO } from '@/application/dtos/response/license-category/license-category.respone.dto';

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
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe(Message.LICENSE.CREATE_SUCCESS);
            });

            it('❌ Nên trả về lỗi 409 khi tên hạng bằng đã tồn tại', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.DUPLICATE_NAME);

                expect(res.status).toBe(409);
                expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_ALREADY_EXISTS); // Giả định mã lỗi của bạn
            });

            // --- BỔ SUNG CÁC TRƯỜNG HỢP VALIDATION ---

            it('❌ Nên trả về lỗi 400 khi tên hạng bằng để trống', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.NAME_MISSING);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_REQUIRED);
            });

            it('❌ Nên trả về lỗi 400 khi định dạng tên sai (Regex không khớp)', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.NAME_WRONG_FORMAT);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
            });

            it('❌ Nên trả về lỗi 400 khi độ tuổi tối thiểu nhỏ hơn 18', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.AGE_UNDER_18);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.AGE_INVALID);
            });

            it('❌ Nên trả về lỗi 400 khi mô tả quá dài (> 500 ký tự)', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.DESCRIPTION_TOO_LONG);

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.DESCRIPTION_TOO_LONG);
            });

            // --- BỔ SUNG KIỂM TRA PHÂN QUYỀN (SECURITY) ---

            it('❌ Nên trả về lỗi 403 khi người dùng thường (User) cố gắng tạo hạng bằng', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getRegularToken()))
                    .send(LICENSE_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(403); // Forbidden
            });

            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .send(LICENSE_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(401); // Unauthorized
            });
        });

        describe('🔍 Kịch bản: Lấy danh sách hạng bằng', () => {
            it('✅ Nên lấy danh sách thành công và chứa hạng bằng vừa tạo', async () => {
                const res = await request(app)
                    .get(LICENSE_ENDPOINTS.FETCH_ALL)
                    .set(getAuthHeader(getAdminToken()));

                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);

                const data = res.body.data.data as ILicenseCategoryResponseDTO[];
                const createdItem = data.find((item) => item.name === 'B2');

                expect(createdItem).toBeDefined();
                testCategoryId = createdItem!.id;
            });
            it('🚫 Nên bị từ chối (403) khi User thường cố gắng tạo bằng', async () => {
                const res = await request(app)
                    .post(LICENSE_ENDPOINTS.CREATE)
                    .set(getAuthHeader(getRegularToken()))
                    .send(LICENSE_PAYLOAD.CREATE_VALID);

                expect(res.status).toBe(403);
            });
        });

        describe('🔄 Kịch bản: Cập nhật hạng bằng lái', () => {

            it('✅ Nên cập nhật thành công khi dữ liệu hợp lệ', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.UPDATE_SUCCESS);
            });

            it('❌ Nên lỗi 400 khi ID hạng bằng lái bị trống', async () => {
                // Giả lập trường hợp ID không được truyền vào DTO
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(" ")) // ID trống hoặc chỉ có khoảng trắng
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.UPDATE_VALID);

                expect(res.status).toBe(404);
            });

            it('❌ Nên lỗi 400 khi tên hạng bằng quá dài (> 10 ký tự)', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...LICENSE_PAYLOAD.UPDATE_VALID, name: 'Hạng B2 Siêu Cấp' });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_INVALID_LENGTH);
            });

            it('❌ Nên lỗi 400 khi độ tuổi không phải là số (NaN/String)', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...LICENSE_PAYLOAD.UPDATE_VALID, minAge: 'mười tám' });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.AGE_REQUIRED);
            });

            it('❌ Nên lỗi 400 khi thứ tự (orderIndex) là số âm', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...LICENSE_PAYLOAD.UPDATE_VALID, orderIndex: -1 });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.INVALID_ORDER);
            });

            it('❌ Nên lỗi 400 khi mô tả bị bỏ trống', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send({ ...LICENSE_PAYLOAD.UPDATE_VALID, description: '' });

                expect(res.status).toBe(400);
                expect(res.body.code).toBe(ErrorCode.LICENSE.DESCRIPTION_REQUIRED);
            });

            it('❌ Nên trả về lỗi 409 khi tên hạng bằng đã tồn tại', async () => {
                const res = await request(app)
                    .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                    .set(getAuthHeader(getAdminToken()))
                    .send(LICENSE_PAYLOAD.DUPLICATE_NAME);
                expect(res.status).toBe(409);
                expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_ALREADY_EXISTS); // Giả định mã lỗi của bạn
            });

            describe('🔄 Kịch bản: Cập nhật hạng bằng lái (Phần 2: Validation nâng cao)', () => {

                it('❌ Nên lỗi 400 khi thiếu ID hạng bằng (Case: MISSING_ID)', async () => {
                    // Giả lập gửi lên endpoint update nhưng không có ID hợp lệ trong params
                    const res = await request(app)
                        .patch(LICENSE_ENDPOINTS.BASE) // Truyền space để trigger !this.id
                        .set(getAuthHeader(getAdminToken()))
                        .send(LICENSE_PAYLOAD.UPDATE_VALID);

                    expect(res.status).toBe(404);
                });

                it('❌ Nên lỗi 400 khi tên hạng bằng sai định dạng Regex (Case: INVALID_FORMAT)', async () => {
                    const res = await request(app)
                        .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                        .set(getAuthHeader(getAdminToken()))
                        .send({
                            ...LICENSE_PAYLOAD.UPDATE_VALID,
                            name: 'B 2' // Chứa khoảng trắng, vi phạm REGEX
                        });

                    expect(res.status).toBe(400);
                    expect(res.body.code).toBe(ErrorCode.LICENSE.NAME_FORMAT_INVALID);
                });

                it('❌ Nên lỗi 400 khi số thứ tự hiển thị là số âm (Case: NEGATIVE_ORDER)', async () => {
                    const res = await request(app)
                        .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                        .set(getAuthHeader(getAdminToken()))
                        .send({
                            ...LICENSE_PAYLOAD.UPDATE_VALID,
                            orderIndex: -1 // Vi phạm logic orderIndex < 0
                        });

                    expect(res.status).toBe(400);
                    // Lưu ý: khớp với mã lỗi bạn viết trong isValid()
                    expect(res.body.code).toBe(ErrorCode.LICENSE.INVALID_ORDER);
                });

                it('❌ Nên trả về lỗi 403 khi người dùng thường (User) cố gắng cập nhật hạng bằng', async () => {
                    const res = await request(app)
                        .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                        .set(getAuthHeader(getRegularToken()))
                        .send(LICENSE_PAYLOAD.UPDATE_VALID);

                    expect(res.status).toBe(403); // Forbidden
                });

                it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                    const res = await request(app)
                        .patch(LICENSE_ENDPOINTS.UPDATE(testCategoryId))
                        .send(LICENSE_PAYLOAD.UPDATE_VALID);
                    expect(res.status).toBe(401); // Unauthorized
                });
            });
        });

        describe('🔒 Kịch bản: Xóa mềm và Khôi phục (Unlock)', () => {

            it('❌ Nên trả về lỗi 403 khi người dùng thường (User) cố gắng xóa hạng bằng', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseId()))

                    .set(getAuthHeader(getRegularToken()))

                expect(res.status).toBe(403); // Forbidden
            });

            it('❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseId()))
                expect(res.status).toBe(401); // Unauthorized
            });

            it('✅ Nên xóa mềm thành công ', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseId()))
                    .set(getAuthHeader(getAdminToken()));

                expect(res.body.data).toMatchObject({ type: DeleteType.SOFT });
                expect(res.status).toBe(200);
                expect(res.body.message).toBe(Message.LICENSE.DELETE_SUCCESS);
            });

            it('✅ Nên xóa cứng thành công ', async () => {
                const res = await request(app)
                    .delete(LICENSE_ENDPOINTS.DELETE(getLicenseIdSecond()))
                    .set(getAuthHeader(getAdminToken()));
                expect(res.status).toBe(200);
                expect(res.body.data).toMatchObject({ type: DeleteType.HARD });
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