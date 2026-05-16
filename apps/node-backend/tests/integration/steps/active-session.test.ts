// tests/integration/steps/active-session.steps.ts
import request from "supertest";
import app from "@/app";
import { ErrorCode } from "@/shared/errors";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import {
  ACTIVE_SESSION_PAYLOAD,
  ACTIVE_SESSION_ENDPOINTS,
  fakeExamId,
  fakeSessionId,
} from "../../config";
import { describe, it, expect } from "@jest/globals";
import { getAuthHeader } from "../../helpers/auth.helper";

const { START, SYNC } = ACTIVE_SESSION_PAYLOAD;

export const activeSessionSteps = (
  getRegularToken: () => string,
  getExamId: () => string,
  getAnotherExamId: () => string,
  setActiveSessionId: (id: string) => void,
  setValidQuestionId: (id: string) => void,
) => {
  let activeSessionId = ""; // Sẽ hứng chuỗi sessionId động
  
  describe("📂 Active Session Management API Suite", () => {
    describe("📝 NHÓM 1: GUEST ROUTES (PUBLIC) - Thi thử", () => {
      it("✅ Nên khởi tạo đề thi thử hợp lệ cho Khách (Không lưu DB)", async () => {
        const res = await request(app)
          .post(ACTIVE_SESSION_ENDPOINTS.GUEST_START)
          .send(START.VALID(getExamId()));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(Message.SESSION.START_SUCCESS);
        // 🚀 FIX 1: Đổi từ .id sang .sessionId cho khớp với Mapper của thiết kế Backend
        expect(res.body.data.sessionId).toBeDefined();
      });

      it("❌ Nên ném lỗi 400 khi Payload trống", async () => {
        const res = await request(app)
          .post(ACTIVE_SESSION_ENDPOINTS.GUEST_START)
          .send(START.EMPTY());

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_EXAM_ID);
      });

      it("❌ Nên ném lỗi 400 khi examId sai định dạng", async () => {
        const res = await request(app)
          .post(ACTIVE_SESSION_ENDPOINTS.GUEST_START)
          .send(START.INVALID_EXAM_TYPE());

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_EXAM_ID);
      });

      it("❌ Nên ném lỗi 404 khi Đề thi (examId) không tồn tại", async () => {
        const res = await request(app)
          .post(ACTIVE_SESSION_ENDPOINTS.GUEST_START)
          .send(START.VALID(fakeExamId));

        expect(res.status).toBe(404);
        expect(res.body.code).toBe(ErrorCode.EXAM.NOT_FOUND);
      });
    });

    describe("📝 NHÓM 2: PROTECTED ROUTES (Học viên đăng nhập)", () => {
      describe("👉 Kịch bản: Bắt đầu phiên thi (POST /start)", () => {
        it("🚫 Nên bị từ chối 401 khi không có Token", async () => {
          const res = await request(app)
            .post(ACTIVE_SESSION_ENDPOINTS.START)
            .send(START.VALID(getExamId()));
          expect(res.status).toBe(401);
        });

        it("✅ Nên khởi tạo đề thi mới hoàn toàn (Hệ thống chưa có session cũ)", async () => {
          const res = await request(app)
            .post(ACTIVE_SESSION_ENDPOINTS.START)
            .set(getAuthHeader(getRegularToken()))
            .send(START.VALID(getExamId()));

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);

          activeSessionId = res.body.data.sessionId;
          setActiveSessionId(activeSessionId);

          const mockQuestionId =
            res.body.data.questions?.[0]?.id ||
            "f47ac10b-58cc-4372-a567-0e02b2c3d479";

          setValidQuestionId(mockQuestionId);
        });

        it("❌ Nên ném 409 Conflict khi Học viên đang làm đề A mà tạo mới đề B (isForce: false)", async () => {
          const res = await request(app)
            .post(ACTIVE_SESSION_ENDPOINTS.START)
            .set(getAuthHeader(getRegularToken()))
            .send(START.VALID(getAnotherExamId(), false));

          expect(res.status).toBe(409);
          expect(res.body.code).toBe(ErrorCode.SYSTEM.ALREADY_EXISTS);
        });

        it("✅ Nên ghi đè (Overwrite) làm lại từ đầu nếu gửi cờ isForce: true", async () => {
          const res = await request(app)
            .post(ACTIVE_SESSION_ENDPOINTS.START)
            .set(getAuthHeader(getRegularToken()))
            .send(START.VALID(getExamId(), true));

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          // 🚀 FIX 4: Cập nhật lại token session mới sinh sau khi Overwrite
          activeSessionId = res.body.data.sessionId;
        });
      });

      describe("👉 Kịch bản: Đồng bộ đáp án (PATCH /sync)", () => {
        it("✅ Nên đồng bộ đáp án thành công khi Payload chuẩn", async () => {
          // Đoạn này giờ activeSessionId đã có giá trị thực nên sẽ ăn ngon lành 200
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.VALID(getExamId(), activeSessionId));

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
        });

        it("❌ Nên ném 400 khi thiếu sessionId", async () => {
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.MISSING_SESSION_ID(getExamId()));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.SESSION_ID_REQUIRED);
        });

        it("❌ Nên ném 400 khi index câu hỏi bị âm", async () => {
          // Có activeSessionId hợp lệ truyền qua factory -> Vượt qua bước check Session ID trống
          // và đập trúng điều kiện validate index âm -> Trả về đúng SES_107
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.NEGATIVE_INDEX(getExamId(), activeSessionId));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_QUESTION_INDEX);
        });

        it("❌ Nên ném 404 khi Session không tồn tại trong DB NoSQL", async () => {
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.FAKE_SESSION(getExamId(), fakeSessionId));

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.ACTIVE_SESSION.NOT_FOUND);
        });
        it("❌ Nên ném 400 khi thiếu examId khi đồng bộ", async () => {
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.MISSING_EXAM_ID(activeSessionId));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.EXAM_ID_REQUIRED);
        });

        it("❌ Nên ném 400 khi answers sai định dạng (không phải object)", async () => {
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.INVALID_ANSWERS_FORMAT(getExamId(), activeSessionId));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.ANSWER_FORMAT_INVALID);
        });

        it("❌ Nên ném 400 khi thiếu clientTimestamp", async () => {
          const res = await request(app)
            .patch(ACTIVE_SESSION_ENDPOINTS.SYNC)
            .set(getAuthHeader(getRegularToken()))
            .send(SYNC.MISSING_TIMESTAMP(getExamId(), activeSessionId));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(
            ErrorCode.SESSION.CLIENT_TIMESTAMP_REQUIRED,
          );
        });
      });

      describe("👉 Kịch bản: Kiểm tra phiên hiện tại (GET /current)", () => {
        it("✅ Nên lấy được phiên làm bài dở dang", async () => {
          const res = await request(app)
            .get(ACTIVE_SESSION_ENDPOINTS.CURRENT)
            .set(getAuthHeader(getRegularToken()));

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe(Message.SESSION.FOUND);
          // 🚀 FIX 5: Assert khớp định dạng trường .sessionId
          expect(res.body.data.sessionId).toBe(activeSessionId);
        });
      });

      describe("👉 Kịch bản: Xóa / Hủy bài thi (DELETE /current)", () => {
        it("✅ Nên xóa phiên làm bài thành công", async () => {
          const res = await request(app)
            .delete(ACTIVE_SESSION_ENDPOINTS.CURRENT)
            .set(getAuthHeader(getRegularToken()));

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
        });

        it("✅ Nên trả về dữ liệu rỗng (NOT_FOUND) khi gọi lại GET /current sau khi đã xóa", async () => {
          const res = await request(app)
            .get(ACTIVE_SESSION_ENDPOINTS.CURRENT)
            .set(getAuthHeader(getRegularToken()));

          expect(res.status).toBe(200);
          expect(res.body.data).toBeNull();
          expect(res.body.message).toBe(Message.SESSION.NOT_FOUND);
        });
      });
    });
  });
};
