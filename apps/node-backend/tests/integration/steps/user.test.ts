import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import app from "@/app";

import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  USER_UPDATE_DATA,
  AUTH_PAYLOAD,
  Message,
  ErrorStatus,
  ErrorCode,
  getMockAdminCreateUserValid,
  getMockAdminCreateUserInvalid,
  getAdminUpdateProfileMockData,
  getAdminUpdateUserMockData,
} from "../../config/index";
import { getAuthHeader } from "../../helpers/auth.helper";

/**
 * Tác dụng: Tập hợp các bài kiểm tra tích hợp cho quản lý người dùng.
 * Kịch bản: Tách biệt Token Admin/User và xử lý vòng đời Token sau khi đổi mật khẩu.
 */
/**
 * @description Định nghĩa kịch bản kiểm thử Phase 2: Thao tác trên Người dùng
 * @param {() => string} getAdminToken - Hàm lấy Access Token của Quản trị viên
 * @param {() => string} getStudentId - Hàm lấy ID của Học viên (Student) từ Seed Data
 * @param {() => string} getTeacherId - Hàm lấy ID của Giáo viên (Teacher) từ Seed Data
 */
export const userSteps = (
  getAdminToken: () => string,
  getStudentId: () => string,
  getTeacherId: () => string,
) => {
  // --- 📦 BỘ KHAI BÁO BIẾN TOÀN CỤC CỦA SUITE ---
  let regularUserId: string;
  let regularToken: string;
  let adminToken: string;
  let targetUserId: string;
  let studentRoleId: string;
  let teacherRoleId: string;

  // Khai báo sẵn các biến chứa Mock Data
  let mockValid: ReturnType<typeof getMockAdminCreateUserValid>;
  let mockInvalid: ReturnType<typeof getMockAdminCreateUserInvalid>;
  let uowData: ReturnType<typeof getAdminUpdateUserMockData>;
  let profileData: ReturnType<typeof getAdminUpdateProfileMockData>;

  // --- 🔑 KHỐI KHỞI ĐỘNG TỔNG (GOM TOÀN BỘ DATA & TOKEN VÀO ĐÂY) ---
  beforeAll(async () => {
    // 1. Lấy Token cho Regular User
    const userLogin = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
      username: AUTH_PAYLOAD.USER_TEST.username,
      password: AUTH_PAYLOAD.USER_TEST.newPassword,
    });

    regularToken = userLogin.body.data.accessToken;
    regularUserId = userLogin.body.data.user.id;
    targetUserId = regularUserId;

    // 2. Lấy Token Admin và ID các Roles từ file test chính truyền sang
    adminToken = getAdminToken();
    studentRoleId = getStudentId();
    teacherRoleId = getTeacherId();

    // 3. Khởi tạo toàn bộ Mock Data 1 lần duy nhất để dùng chung cho tất cả các Phase bên dưới
    mockValid = getMockAdminCreateUserValid(studentRoleId, teacherRoleId);
    mockInvalid = getMockAdminCreateUserInvalid(studentRoleId);
    uowData = getAdminUpdateUserMockData(studentRoleId, teacherRoleId);
    profileData = getAdminUpdateProfileMockData();
  });

  describe("👤 User Management API Suite", () => {
    // --- PHASE 1: USER SELF-MANAGEMENT ---
    describe("📝 Kịch bản: Người dùng tự quản lý thông tin", () => {
      it("❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ME_PROFILE)
          .send(USER_UPDATE_DATA);
        expect(res.status).toBe(401); // Unauthorized
      });

      it("Nên cập nhật thông tin cá nhân thành công", async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.ME_PROFILE)
          .set(getAuthHeader(regularToken))
          .send(USER_UPDATE_DATA);

        regularToken = response.body.data.accessToken;
        expect(response.status).toBe(200);
        expect(response.body.data.user.fullName).toBe(
          USER_UPDATE_DATA.fullName,
        );
        expect(response.body.message).toBe(Message.USER.UPDATE_SUCCESS);
      });

      it("Nên đổi mật khẩu thành công và CẬP NHẬT lại Token mới", async () => {
        // 1. Thực hiện đổi mật khẩu
        const res = await request(app)
          .patch(USER_ENDPOINTS.ME_PASSWORD)
          .set(getAuthHeader(regularToken))
          .send({
            oldPassword: AUTH_PAYLOAD.USER_TEST.newPassword,
            newPassword: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
            confirmNewPassword: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
          });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(Message.USER.PASSWORD_CHANGED);

        // 2. 💡 Login lại bằng mật khẩu mới để lấy token mới (Chỉ cần làm ở đây là đủ cho toàn bộ các test phía sau)
        const refreshRes = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
        });

        // Ghi đè token mới để dùng cho các Phase sau
        regularToken = refreshRes.body.data.accessToken;
      });
    });

    describe("👑 PHASE 2: Admin User Management API Suite", () => {
      // --- KHỐI 1: KIỂM THỬ PHÂN QUYỀN VÀ BẢO MẬT (AUTHENTICATION & AUTHORIZATION) ---
      describe("🔒 Kịch bản: Bảo mật đường dẫn và phân quyền hệ thống", () => {
        it("❌ Nên trả về lỗi 401 Unauthorized khi không cung cấp Token xác thực", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .send(mockValid.STUDENT_FLOW);

          expect(res.status).toBe(401);
        });

        it("❌ Nên trả về lỗi 403 Forbidden khi tài khoản user thường cố tình truy cập API đặc quyền", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${regularToken}`)
            .send(mockValid.STUDENT_FLOW);

          expect(res.status).toBe(403);
        });
      });

      // --- KHỐI 2: KIỂM THỬ ĐÁNH CHẶN SỚM TẠI CỬA NGÕ DTO (FAIL-FAST VALIDATION) ---
      describe("📝 Kịch bản: Đánh chặn dữ liệu sai định dạng bề mặt (DTO Validation)", () => {
        it("❌ Nên chặn đứng và trả về lỗi 400 khi mật khẩu xác nhận không khớp", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.PASSWORD_MISMATCH);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.PASSWORD_MISMATCH);
        });

        it("❌ Nên chặn đứng và trả về lỗi 400 khi username quá ngắn (< 3 ký tự)", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.USERNAME_TOO_SHORT);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.USERNAME_INVALID);
        });

        it("❌ Nên chặn đứng và trả về lỗi 400 khi email sai định dạng biểu thức chính quy (Regex)", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.INVALID_EMAIL);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.EMAIL_INVALID);
        });

        it("❌ Nên chặn đứng và trả về lỗi 400 khi mảng vai trò (roles) truyền lên bị rỗng", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.EMPTY_ROLES);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.ROLES_REQUIRED);
        });

        it("❌ Nên xử lý làm sạch dữ liệu chuỗi khoảng trắng và ném lỗi 400 hợp lệ", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.SPACES_ONLY);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.USERNAME_INVALID);
        });

        it("❌ Nên kích hoạt cơ chế lọc Type Guard của DTO và chặn đứng mảng vai trò chứa kiểu dữ liệu bẩn", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.ROLES_CONTAIN_INVALID_TYPE);

          // Bảo vệ Runtime cô lập lỗi, tuyệt đối không gây sập ứng dụng (trả về lỗi 500)
          expect(res.status).not.toBe(500);
        });
      });

      // --- KHỐI 3: KIỂM THỬ LOGIC NGHIỆP VỤ TẦNG SÂU (BUSINESS LOGIC & DATABASE) ---
      describe("💼 Kịch bản: Kiểm tra các ràng buộc nghiệp vụ hệ thống (Service Constraints)", () => {
        const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        it("✅ Nên tạo thành công người dùng mới (STUDENT) khi mọi dữ liệu đều hợp lệ", async () => {
          const validPayload = {
            ...mockValid.STUDENT_FLOW,
            username: `student.${uniqueId}`,
            email: `student.${uniqueId}@smart-gplx.com`,
          };

          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validPayload);

          expect(res.status).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.username).toBe(
            validPayload.username.toLowerCase(),
          );
          expect(res.body.message).toBe(Message.USER.CREATED_SUCCESSFULLY);
          expect(res.body.code).toBe("USER_CREATED_SUCCESSFULLY");

          expect(res.body.data.passwordHash).toBeUndefined();
          expect(res.body.data.passwordPlain).toBeUndefined();
        });

        it("❌ Nên từ chối và trả về lỗi 409 Conflict khi Admin cố tình tạo trùng Username đã tồn tại", async () => {
          const validPayload = {
            ...mockValid.STUDENT_FLOW,
            username: `student.${uniqueId}`,
            email: `different.email.${uniqueId}@gmail.com`,
          };

          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validPayload);

          expect(res.status).toBe(409);
          expect(res.body.code).toBe(ErrorCode.AUTH.USERNAME_ALREADY_EXISTS);
        });

        it("❌ Nên từ chối và trả về lỗi 409 Conflict khi Admin cố tình tạo trùng Email đã tồn tại", async () => {
          const validPayload = {
            ...mockValid.STUDENT_FLOW,
            username: `different.user.${uniqueId}`,
            email: `student.${uniqueId}@smart-gplx.com`,
          };

          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validPayload);

          expect(res.status).toBe(409);
          expect(res.body.code).toBe(ErrorCode.AUTH.EMAIL_ALREADY_EXISTS);
        });

        it("❌ Nên ném lỗi nghiệp vụ 400 khi vai trò chỉ định không tồn tại trong cache hệ thống", async () => {
          const res = await request(app)
            .post(USER_ENDPOINTS.ADMIN_CREATE_USER)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(mockInvalid.NON_EXISTENT_ROLE);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.AUTH.ROLES_NOT_INITIALIZED);
        });
      });
    });

    // =========================================================================
    // 👑 UPDATE USER BY ADMIN (PUT /api/v1/users/:id/admin)
    // =========================================================================
    describe("👑 Kịch bản: Admin cập nhật thông tin hệ thống và phân quyền (PUT /:id/admin)", () => {
      it("❌ Nên chặn đứng (400) khi không truyền bất kỳ trường dữ liệu nào lên hệ thống", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.invalid.EMPTY_PAYLOAD);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.MISSING_UPDATE_FIELDS);
      });

      it("❌ Nên chặn đứng (400) khi họ tên truyền lên trống rỗng sau khi trim", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.invalid.SPACES_NAME);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.NAME_REQUIRED);
      });

      it("❌ Nên chặn đứng (400) khi họ tên quá ngắn (< 2 ký tự)", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.invalid.TOO_SHORT_NAME);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.NAME_TOO_SHORT);
      });

      it("❌ Nên chặn đứng (400) khi họ tên vượt quá giới hạn biên (> 100 ký tự)", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.invalid.TOO_LONG_NAME);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.NAME_TOO_LONG);
      });

      it("❌ Nên chặn đứng (400) khi mảng vai trò truyền lên bị rỗng", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.invalid.EMPTY_ROLES);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.ROLES_REQUIRED);
      });

      it("✅ Nên cập nhật thành công (200) phân quyền khi truyền ID vai trò hợp lệ", async () => {
        const res = await request(app)
          .put(USER_ENDPOINTS.ADMIN_UPDATE_USER(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(uowData.valid.FULL_FLOW);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(Message.USER.UPDATE_SUCCESS);
        expect(res.body.data).toBeNull();
      });
    });

    // =========================================================================
    // 👑 UPDATE PROFILE ADMIN (PATCH /api/v1/users/admin/:id)
    // =========================================================================
    describe("👤 Kịch bản: Admin chỉnh sửa hồ sơ và tệp ảnh đại diện của User khác (PATCH /admin/:id)", () => {
      it("❌ Nên chặn đứng (400) khi không cung cấp trường thông tin cập nhật nào", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ADMIN_UPDATE_PROFILE(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(profileData.invalid.EMPTY_PAYLOAD);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.MISSING_UPDATE_FIELDS);
      });

      it("❌ Nên chặn đứng (400) khi họ tên hồ sơ truyền lên trống rỗng", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ADMIN_UPDATE_PROFILE(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(profileData.invalid.EMPTY_NAME);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.NAME_REQUIRED);
      });

      it("❌ Nên chặn đứng (400) khi họ tên hồ sơ vượt quá giới hạn biên (> 50 ký tự)", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ADMIN_UPDATE_PROFILE(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(profileData.invalid.TOO_LONG_NAME);

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.USER.NAME_TOO_LONG);
      });

      it("✅ Nên cập nhật thành công (200) thông tin hồ sơ và trả về đối tượng User hoàn chỉnh", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ADMIN_UPDATE_PROFILE(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .send(profileData.valid.TEXT_ONLY);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(Message.USER.UPDATE_SUCCESS);
        expect(res.body.data).toBeDefined();
      });

      it("✅ Nên chấp nhận đính kèm tệp đa phương tiện (Multipart File Upload) thành công", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.ADMIN_UPDATE_PROFILE(targetUserId))
          .set("Authorization", `Bearer ${adminToken}`)
          .field("fullName", profileData.valid.MULTIPART_FIELD.fullName)
          .attach(
            "pictureFile",
            Buffer.from("fake-image-binary-data"),
            "avatar_test.png",
          );

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
      });
    });

    // --- PHASE 2: ADMIN MANAGEMENT ---
    describe("🚫 Kịch bản: Quyền Quản trị viên (Admin Actions)", () => {
      beforeAll(async () => {
        const refreshRes = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.secondnewPassword,
        });

        if (refreshRes.status === 200) {
          regularToken = refreshRes.body.data.accessToken;
        }
      });

      it("Nên từ chối (403) khi User thường Xóa", async () => {
        const response = await request(app)
          .delete(USER_ENDPOINTS.USER_DELETE(regularUserId))
          .set(getAuthHeader(regularToken)); // regularToken hiện tại đã mang token mới nhất từ bước đổi pass
        expect(response.status).toBe(403); // Forbidden
        expect(response.body.success).toBe(false);
      });

      it("❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực", async () => {
        const res = await request(app)
          .patch(USER_ENDPOINTS.USER_STATUS(regularUserId))
          .send({ status: "ACTIVE" });
        expect(res.status).toBe(401); // Unauthorized
      });

      it("Nên cho phép Admin cập nhật trạng thái người dùng khác", async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.USER_STATUS(regularUserId))
          .set(getAuthHeader(adminToken))
          .send({ status: "ACTIVE" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(Message.USER.STATUS_UPDATED);
      });

      it("Nên từ chối (403) khi User thường  Khôi phục tài khoản", async () => {
        const response = await request(app)
          .patch(USER_ENDPOINTS.USER_RESTORE(regularUserId))
          .set(getAuthHeader(regularToken));

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
      });

      it("Nên cho phép Admin Xóa mềm và Khôi phục tài khoản", async () => {
        // Bước 1: Admin Xóa mềm User
        const deleteRes = await request(app)
          .delete(USER_ENDPOINTS.USER_DELETE(regularUserId))
          .set(getAuthHeader(adminToken));
        expect(deleteRes.status).toBe(200);

        // Bước 2: Kiểm tra User không thể login sau khi bị xóa (423 Locked)
        const loginFail = await request(app).post(AUTH_ENDPOINTS.LOGIN).send({
          username: AUTH_PAYLOAD.USER_TEST.username,
          password: AUTH_PAYLOAD.USER_TEST.secondnewPassword, // Chú ý: Dùng mật khẩu đã đổi ở phase 1
        });
        expect(loginFail.status).toBe(ErrorStatus.AUTH_423);

        // Bước 3: Admin Khôi phục tài khoản
        const restoreRes = await request(app)
          .patch(USER_ENDPOINTS.USER_RESTORE(regularUserId))
          .set(getAuthHeader(adminToken));

        expect(restoreRes.status).toBe(200);
      });

      it("Nên trả về danh sách người dùng khi là Admin", async () => {
        const response = await request(app)
          .get(USER_ENDPOINTS.USERS_LIST)
          .set(getAuthHeader(adminToken))
          .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });
    });

    // --- PHASE 3: SECURITY & AUTHORIZATION ---
    describe("🔒 Kịch bản: Bảo mật & Phân quyền", () => {
      it("Nên từ chối (403) khi User thường cố gắng lấy danh sách người dùng", async () => {
        const response = await request(app)
          .get(USER_ENDPOINTS.USERS_LIST)
          .set(getAuthHeader(regularToken));

        expect(response.status).toBe(403); // Forbidden
        expect(response.body.success).toBe(false);
      });

      it("❌ Nên trả về lỗi 401 khi không cung cấp Token xác thực", async () => {
        const res = await request(app).get(USER_ENDPOINTS.USERS_LIST);
        expect(res.status).toBe(401); // Unauthorized
      });
    });
  });
};
