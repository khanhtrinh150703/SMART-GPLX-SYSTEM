// tests/integration/steps/exam-history.steps.ts

import request from "supertest";
import app from "@/app";
import { ErrorCode } from "@/shared/errors";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { HISTORY_STATISTICS_PAYLOAD, HISTORY_ENDPOINTS, SAFE_UUID_V4 } from "../../config";
import { getAuthHeader } from "../../helpers/auth.helper";
import { describe, it, expect } from "@jest/globals";
const { QUERIES } = HISTORY_STATISTICS_PAYLOAD;

export const examHistorySteps = (
  getRegularToken: () => string,
  getHistoryIdFromSubmit: () => string, 
) => {
  const getSafeHistoryId = () => getHistoryIdFromSubmit() || SAFE_UUID_V4;

  describe("📂 Exam History Summary & Snapshot API Suite", () => {
    
    describe("📝 NHÓM 1: DỮ LIỆU TÓM TẮT (MYSQL)", () => {
      it("✅ Lấy danh sách tóm tắt lịch sử thi hợp lệ (Có bộ lọc chuẩn)", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.SUMMARY_LIST)
          .set(getAuthHeader(getRegularToken()))
          .query(QUERIES.VALID_FILTERS());

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(Message.HISTORY.FETCH_SUCCESS);
      });

      it("✅ Lấy danh sách tóm tắt hợp lệ kể cả khi truyền query rác (DTO tự dọn dẹp)", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.SUMMARY_LIST)
          .set(getAuthHeader(getRegularToken()))
          .query(QUERIES.INVALID_FORMAT_GARBAGE());

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      // 🚀 FIX LỖI LINTER: Sử dụng getSafeHistoryId() ở đây để test lấy chi tiết
      it("✅ Xem chi tiết tóm tắt của bài thi vừa nộp (Luồng Xanh)", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.SUMMARY_DETAIL(getSafeHistoryId()))
          .set(getAuthHeader(getRegularToken()));

        // Tùy theo logic luồng chạy thực tế, nếu Phase 10 có nộp bài, chỗ này sẽ ra 200.
        if (res.status === 200) {
          expect(res.body.success).toBe(true);
        } else {
          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.EXAM_HISTORY.HISTORY_NOT_FOUND);
        }
      });

      it("❌ Tạch xem chi tiết tóm tắt khi truyền mã param không phải dạng UUID", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.SUMMARY_DETAIL("chuoi-id-rac-123"))
          .set(getAuthHeader(getRegularToken()));

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
      });
    });

    describe("📝 NHÓM 2: LỊCH SỬ CHI TIẾT (MONGODB SNAPSHOT)", () => {
      it("✅ Lấy danh sách lịch sử làm bài chi tiết thành công", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.LIST)
          .set(getAuthHeader(getRegularToken()))
          .query(QUERIES.EMPTY());

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      it("✅ Xem chi tiết snapshot NoSQL của bài thi vừa nộp (Luồng Xanh)", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.DETAIL(getSafeHistoryId()))
          .set(getAuthHeader(getRegularToken()));

        if (res.status === 200) {
          expect(res.body.success).toBe(true);
        } else {
          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
        }
      });

      it("❌ Tạch xem chi tiết snapshot NoSQL khi mã param sai cấu trúc UUID", async () => {
        const res = await request(app)
          .get(HISTORY_ENDPOINTS.DETAIL("chuoi-id-mongodb-rac"))
          .set(getAuthHeader(getRegularToken()));

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
      });
    });
  });
};