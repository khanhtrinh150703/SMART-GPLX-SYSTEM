// tests/integration/steps/user-statistics.steps.ts

import request from "supertest";
import app from "@/app";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { STATISTICS_ENDPOINTS, SAFE_UUID_V4, ErrorCode } from "../../config";
import { getAuthHeader } from "../../helpers/auth.helper";
import { describe, it, expect } from "@jest/globals";

export const userStatisticsSteps = (
  _getAdminToken: () => string,
  getRegularToken: () => string,
) => {
  describe("📂 User Statistics & Progress API Suite", () => {
    describe("📝 NHÓM 1: TRUY VẤN TIẾN ĐỘ HỌC TẬP (USER SCOPE)", () => {
      it("✅ Lấy tổng quan thống kê dashboard cá nhân thành công", async () => {
        const res = await request(app)
          .get(STATISTICS_ENDPOINTS.ME)
          .set(getAuthHeader(getRegularToken()));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(Message.STATISTICS.FETCH_SUCCESS);
        expect(res.body.data).toBeDefined();
      });

      it("✅ Lấy danh sách tiến độ chi tiết theo từng chủ đề thành công", async () => {
        const res = await request(app)
          .get(STATISTICS_ENDPOINTS.TOPICS)
          .set(getAuthHeader(getRegularToken()));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
      });

      it("❌ Trả về 400 khi xem chi tiết chủ đề bằng một mã topicId chuỗi rác", async () => {
        const res = await request(app)
          .get(STATISTICS_ENDPOINTS.TOPIC_DETAIL("chuoi-topic-rac-999"))
          .set(getAuthHeader(getRegularToken()));

        // Đồng bộ kiến trúc: Không có middleware chặn vằn UUID nên lọt xuống Service báo ST_001
        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
      });

      it("✅ Trả về 200 (Luồng xanh bảo vệ Web) khi truyền mã topicId dạng UUID chuẩn nhưng chưa có data", async () => {
        const res = await request(app)
          .get(STATISTICS_ENDPOINTS.TOPIC_DETAIL(SAFE_UUID_V4))
          .set(getAuthHeader(getRegularToken()));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe("📝 NHÓM 2: ĐỒNG BỘ DỮ LIỆU THỦ CÔNG (ADMIN SCOPE)", () => {
      it("🚫 Từ chối phân quyền (403) khi học viên thường cố gọi lệnh đồng bộ dữ liệu của Admin", async () => {
        const res = await request(app)
          .post(STATISTICS_ENDPOINTS.SYNC)
          .set(getAuthHeader(getRegularToken()))
          .send({}); // Theo yêu cầu: ném đúng token là ok, không cần truyền body

        expect(res.status).toBe(403);
      });

      // it("✅ Đồng bộ thủ công thành công khi Admin ném đúng Token kèm userId hợp lệ", async () => {
      //   const res = await request(app)
      //     .post(STATISTICS_ENDPOINTS.SYNC)
      //     .set(getAuthHeader(getAdminToken()))
      //     .send({ userId: SAFE_UUID_V4 }); 

      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      // });
    });
  });
};
