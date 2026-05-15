// src/tests/integration/steps/exam-steps.test.ts
import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import app from "@/app";
import { EXAM_ENDPOINTS } from "../../config/endpoints";
import { EXAM_PAYLOAD } from "../../config/test-data";
import { ErrorCode, ErrorStatus } from "@/shared/errors";
import prisma from "../../../prisma/prisma";

/**
 * @description Tập hợp các bài kiểm tra tích hợp cho phân hệ Đề thi.
 * Được thiết kế để chạy nối tiếp (Phase 8) trong luồng Test hệ thống.
 *
 * @param getAdminToken Closure lấy JWT của Admin (exams:manage)
 * @param getStudentToken Closure lấy JWT của Học viên (exams:read)
 * @param getLicenseId Closure lấy ID Hạng bằng lái thật từ DB
 * @param getExamMatrixId Closure lấy ID Ma trận đề thi thật từ DB
 */
export const examSteps = (
  getAdminToken: () => string,
  getStudentToken: () => string,
  getLicenseId: () => string,
  getExamMatrixId: () => string,
) => {
  // Biến lưu trữ ID sinh ra trong quá trình test
  let createdManualExamId = "";
  let createdAutoExamId = "";
  let realQuestionIds: string[] = [];

  // Chuỗi định danh độc nhất giúp tránh lỗi trùng lặp khi chạy test nhiều lần trên DB tĩnh
  const uniqueSuffix = Date.now().toString().slice(-6);
  const manualExamName = `Đề thi thủ công Test ${uniqueSuffix}`;
  const autoExamName = `Đề thi tự động Test ${uniqueSuffix}`;

  beforeAll(async () => {
    // 🚀 Lấy một số ID câu hỏi có thật trong DB (đã được tạo từ Phase 5: Question Operations)
    // Để phục vụ cho việc test tạo đề thi thủ công
    const questions = await prisma.question.findMany({
      where: { deletedAt: null },
      take: 5,
      select: { id: true },
    });

    realQuestionIds = questions.map((q) => q.id);
  });

  describe("📝 Phân hệ Quản lý Đề thi (Exam-Mgmt)", () => {
    describe("🛡️ Kịch bản 1: Phân quyền & Định tuyến (RBAC & Auth Boundaries)", () => {
      it("Nên chặn truy cập khi không truyền Token vào API bảo mật", async () => {
        const response = await request(app)
          .post(EXAM_ENDPOINTS.CREATE_MANUAL)
          .send({});
        expect(response.status).toBe(401);
      });

      it("Nên báo lỗi 403 Forbidden nếu Tài khoản không có quyền exams:manage", async () => {
        const response = await request(app)
          .post(EXAM_ENDPOINTS.CREATE_MANUAL)
          .set("Authorization", `Bearer ${getStudentToken()}`)
          .send({});
        expect(response.status).toBe(403);
      });
    });

    describe("🔓 Kịch bản 2: Các điểm cuối công cộng (Public Endpoints)", () => {
      it("Nên lấy được danh sách bài thi công khai mà không cần Token", async () => {
        const response = await request(app).get(EXAM_ENDPOINTS.LIST_PUBLIC);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data?.data)).toBe(true);
      });

      it("Nên trả về 404 khi cố truy cập chi tiết một Đề thi bằng ID giả", async () => {
        const fakeId = EXAM_PAYLOAD.INVALID.SERVICE_LEVEL.NON_EXISTENT_ID;
        const response = await request(app).get(
          EXAM_ENDPOINTS.DETAIL_PUBLIC(fakeId),
        );

        expect(response.status).toBe(404);
        expect(response.body.code).toBe(ErrorCode.EXAM.NOT_FOUND);
      });
    });

    describe("❌ Kịch bản 3: Rào cản xác thực DTO (Fail-Fast Validation)", () => {
      // Các payload lỗi có thể dùng chung cấu hình tĩnh vì nó bị chặn trước khi vào Service
      const validationCases = [
        {
          label: "Tên đề thi để trống",
          payload: EXAM_PAYLOAD.INVALID.DTO_LEVEL.EMPTY_NAME,
          code: ErrorCode.EXAM.NAME_REQUIRED,
        },
        {
          label: "Thời gian làm bài không hợp lệ (<= 0)",
          payload: EXAM_PAYLOAD.INVALID.DTO_LEVEL.ZERO_DURATION,
          code: ErrorCode.EXAM.INVALID_DURATION,
        },
        {
          label: "Điểm đạt vượt quá tổng số câu hỏi",
          payload: EXAM_PAYLOAD.INVALID.DTO_LEVEL.SCORE_OVER_LIMIT,
          code: ErrorCode.EXAM.PASSING_SCORE_TOO_HIGH,
        },
      ];

      validationCases.forEach(({ label, payload, code }) => {
        it(`Nên trả về lỗi khi ${label}`, async () => {
          const response = await request(app)
            .post(EXAM_ENDPOINTS.CREATE_MANUAL)
            .set("Authorization", `Bearer ${getAdminToken()}`)
            .send(payload);

          // Lấy status từ Map, mặc định 400
          const expectedStatus =
            ErrorStatus[code as keyof typeof ErrorStatus] || 400;
          expect(response.status).toBe(expectedStatus);
          expect(response.body.code).toBe(code);
        });
      });
    });

    describe("✍️ Kịch bản 4: Khởi tạo Đề thi Thủ công (Manual Create)", () => {
      it("Nên báo lỗi tham chiếu khi chứa ID câu hỏi giả mạo (Parallel Validation)", async () => {
        const dynamicPayload = {
          name: "Đề thi lỗi chứa fake ID",
          // SỬA LẠI: Dùng chuẩn UUID v4 để không làm sập Prisma
          userId: "550e8400-e29b-41d4-a716-446655440000",
          licenseCategoryId: getLicenseId(),
          durationMinutes: 20,
          passingScore: 1,
          minCriticalQuestions: 1,
          questionIds: [
            realQuestionIds[0],
            "00000000-0000-0000-0000-000000000000",
          ],
        };

        const response = await request(app)
          .post(EXAM_ENDPOINTS.CREATE_MANUAL)
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(dynamicPayload);

        expect(response.status).toBe(422);
        expect(response.body.code).toBe(ErrorCode.EXAM.QUESTION_DATA_INVALID);
      });

      it("Nên khởi tạo THÀNH CÔNG đề thi thủ công với dữ liệu hợp lệ", async () => {
        expect(realQuestionIds.length).toBeGreaterThan(0);

        const validPayload = {
          name: manualExamName,
          userId: "admin-user-id",
          licenseCategoryId: getLicenseId(),
          durationMinutes: 20,
          passingScore: realQuestionIds.length,
          minCriticalQuestions: 0,
          questionIds: realQuestionIds,
          status: "ACTIVE",
        };

        const response = await request(app)
          .post(EXAM_ENDPOINTS.CREATE_MANUAL)
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(validPayload);

        // Sửa lại: API của bạn trả về 200 thay vì 201
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();

        createdManualExamId = response.body.data.id;
      });

      it("Nên chặn tạo mới và báo lỗi Trùng lặp tên đề thi", async () => {
        // Cố tình dùng lại tên vừa tạo thành công ở trên
        const duplicatePayload = {
          name: manualExamName,
          userId: "admin-user-id",
          licenseCategoryId: getLicenseId(),
          durationMinutes: 20,
          passingScore: realQuestionIds.length,
          minCriticalQuestions: 0,
          questionIds: realQuestionIds,
        };

        const response = await request(app)
          .post(EXAM_ENDPOINTS.CREATE_MANUAL)
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(duplicatePayload);

        expect(response.status).toBe(409); // Conflict
        expect(response.body.code).toBe(ErrorCode.EXAM.NAME_ALREADY_EXISTS);
      });
    });

    describe("🤖 Kịch bản 5: Sinh đề thi tự động (Auto Generation)", () => {
      it("Nên báo lỗi khi mã Ma trận (MatrixId) không tồn tại trong hệ thống", async () => {
        // 🚀 Dữ liệu được gọi trực tiếp từ bộ Dataset tập trung, hoàn toàn tách biệt khỏi logic hàm test
        const response = await request(app)
          .post(EXAM_ENDPOINTS.GENERATE_AUTO)
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(EXAM_PAYLOAD.INVALID.SERVICE_LEVEL.MATRIX_NOT_FOUND);

        // Đoạn này hệ thống sẽ lọt mượt mà qua DTO, đâm xuống tầng Service và ném lỗi 404 chuẩn xác
        expect(response.status).toBe(404);
        expect(response.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
      });

      it("Nên sinh đề tự động THÀNH CÔNG từ Ma trận hợp lệ", async () => {
        const payload = {
          matrixId: getExamMatrixId(),
          userId: "admin-user-id",
          name: autoExamName,
          status: "ACTIVE",
        };

        const response = await request(app)
          .post(EXAM_ENDPOINTS.GENERATE_AUTO)
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();

        createdAutoExamId = response.body.data.id;
      });
    });

    describe("📝 Kịch bản 6: Cập nhật thông tin từng phần (Partial Update)", () => {
      it("Nên chặn cập nhật thời gian phi logic (endedAt <= startedAt)", async () => {
        const response = await request(app)
          .patch(EXAM_ENDPOINTS.EDIT(createdManualExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(EXAM_PAYLOAD.INVALID.DTO_LEVEL.INVALID_TIME_RANGE);

        expect(response.status).toBe(400);
        expect(response.body.code).toBe(ErrorCode.EXAM.INVALID_TIME_RANGE);
      });

      it("Nên cập nhật thành công các thông số cơ bản", async () => {
        const updatePayload = {
          durationMinutes: 45,
          passingScore: 1,
        };

        const response = await request(app)
          .patch(EXAM_ENDPOINTS.EDIT(createdManualExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send(updatePayload);

        expect(response.status).toBe(200);
        expect(response.body.data.durationMinutes).toBe(45);
      });
    });

    describe("🗑️ Kịch bản 7: Xóa thông minh & Khôi phục (Smart Delete & Restore)", () => {
      it("Nên thực thi Soft Delete (Xóa mềm) thay vì Hard Delete do đề tự động luôn có Snapshot", async () => {
        const response = await request(app)
          .delete(EXAM_ENDPOINTS.DELETE(createdAutoExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        // SỬA LẠI: Đổi kỳ vọng từ HARD sang SOFT vì hệ thống của bạn tự sinh snapshot
        expect(response.body.data.type).toBe("SOFT");
      });

      it("Nên thực thi Soft Delete (Xóa mềm) đối với đề thi chứa Snapshot câu hỏi", async () => {
        // Đề thủ công đã sinh Snapshot lúc create -> Sẽ kích hoạt Soft Delete
        const response = await request(app)
          .delete(EXAM_ENDPOINTS.DELETE(createdManualExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.data.type).toBe("SOFT");
      });

      it("Nên báo lỗi NOT_FOUND nếu cố chỉnh sửa đề thi đã bị xóa mềm", async () => {
        const response = await request(app)
          .patch(EXAM_ENDPOINTS.EDIT(createdManualExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`)
          .send({ durationMinutes: 10 });

        expect(response.status).toBe(404);
        expect(response.body.code).toBe(ErrorCode.EXAM.NOT_FOUND);
      });

      it("Nên khôi phục (Restore) THÀNH CÔNG đề thi đã xóa mềm", async () => {
        const response = await request(app)
          .patch(EXAM_ENDPOINTS.RESTORE(createdManualExamId))
          .set("Authorization", `Bearer ${getAdminToken()}`);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(createdManualExamId);
      });
    });
  });
};
