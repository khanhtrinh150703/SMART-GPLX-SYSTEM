// tests/integration/steps/exam-attempt.steps.ts

import request from "supertest";
import app from "@/app";
import { ErrorCode } from "@/shared/errors";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { describe, it, expect } from "@jest/globals";
import {
  EXAM_ATTEMPT_PAYLOAD,
  EXAM_ATTEMPT_ENDPOINTS,
  SAFE_UUID_V4,
  UUID_V4_REGEX,
  ACTIVE_SESSION_ENDPOINTS,
} from "../../config";
import { getAuthHeader } from "../../helpers/auth.helper";

const { BASE_DATA, VALIDATE_ERRORS } = EXAM_ATTEMPT_PAYLOAD;

export const examAttemptSteps = (
  getRegularToken: () => string,
  getExamId: () => string,
  getActiveSessionId: () => string,
  getValidQuestionId: () => string,
  setHistoryId: (id: string) => void,
) => {
  // 🛡️ BỘ ĐIỀU PHỐI LAZY GETTER AN TOÀN: Đảm bảo luôn trả về đúng định dạng UUID v4 khi thực thi test
  const getSafeExamId = () => {
    const id = getExamId();
    return typeof id === "string" && UUID_V4_REGEX.test(id) ? id : SAFE_UUID_V4;
  };

  const getSafeSessionId = () => {
    const id = getActiveSessionId();
    return typeof id === "string" && UUID_V4_REGEX.test(id) ? id : SAFE_UUID_V4;
  };

  const getSafeQuestionId = () => {
    const id = getValidQuestionId();
    return typeof id === "string" && UUID_V4_REGEX.test(id) ? id : SAFE_UUID_V4;
  };

  describe("📂 Exam Attempt & Evaluation API Suite", () => {
    describe("📝 NHÓM 1: GUEST ROUTES (PUBLIC) - Nộp bài khách", () => {
      it("✅ Luồng thành công: Khách nộp bài thi thử hợp lệ (Không lưu snapshot DB)", async () => {
        const payload = BASE_DATA(
          getSafeExamId(),
          SAFE_UUID_V4,
          getSafeQuestionId(),
        );

        const res = await request(app)
          .post(EXAM_ATTEMPT_ENDPOINTS.GUEST_COMPLETE)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe(Message.EXAM.COMPLETE_SUCCESS);
      });

      it("❌ Nên ném lỗi 400 khi Payload trống rỗng", async () => {
        const res = await request(app)
          .post(EXAM_ATTEMPT_ENDPOINTS.GUEST_COMPLETE)
          .send(VALIDATE_ERRORS.EMPTY_PAYLOAD());

        expect(res.status).toBe(400);
        expect(res.body.code).toBe(ErrorCode.SYSTEM.INVALID_INPUT);
      });
    });

    describe("📝 NHÓM 2: PROTECTED ROUTES (Học viên đăng nhập)", () => {
      it("🚫 Nên bị từ chối 401 khi nộp bài chính thức mà không đính kèm Token", async () => {
        const payload = BASE_DATA(
          getSafeExamId(),
          getSafeSessionId(),
          getSafeQuestionId(),
        );

        const res = await request(app)
          .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
          .send(payload);

        expect(res.status).toBe(401);
      });

      describe("❌ Băm vằn bộ chốt chặn Validation của tầng DTO", () => {
        it("❌ Tạch khi examId trống rỗng", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(VALIDATE_ERRORS.INVALID_EXAM_ID_EMPTY(getSafeSessionId()));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_EXAM_ID);
        });

        it("❌ Tạch khi examId không phải UUID chuẩn", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(VALIDATE_ERRORS.INVALID_EXAM_ID_UUID(getSafeSessionId()));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
        });

        it("❌ Tạch khi sessionId trống rỗng", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(VALIDATE_ERRORS.INVALID_SESSION_ID_EMPTY(getSafeExamId()));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SYSTEM.INVALID_INPUT);
        });

        it("❌ Tạch khi sessionId sai định dạng UUID", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(VALIDATE_ERRORS.INVALID_SESSION_ID_UUID(getSafeExamId()));

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
        });

        it("❌ Tạch khi thời gian làm bài timeSpent bị âm", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.INVALID_TIME_SPENT(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_TIME_SPENT);
        });

        it("❌ Tạch khi thời gian còn lại timeRemaining bị âm", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.INVALID_TIME_REMAINING(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_TIME_REMAINING);
        });

        it("❌ Tạch khi chuỗi clientFinishedAt sai cấu trúc Date", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.INVALID_FINISHED_DATE(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_FINISHED_DATE);
        });

        it("❌ Tạch khi mảng answers trống không", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.ANSWERS_REQUIRED(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.ANSWERS_REQUIRED);
        });

        it("❌ Tạch khi cấu trúc item trong mảng câu trả lời sai kiểu dữ liệu", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.ANSWER_FORMAT_INVALID(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.ANSWER_FORMAT_INVALID);
        });

        it("❌ Tạch khi questionId của item trong mảng answers không phải UUID", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.ANSWER_QUESTION_NOT_UUID(
                getSafeExamId(),
                getSafeSessionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.VALIDATION.ID_INVALID_UUID);
        });

        it("❌ Tạch khi giá trị đáp án answer bằng 0 hoặc âm", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.INVALID_ANSWER_VALUE_ZERO(
                getSafeExamId(),
                getSafeSessionId(),
                getSafeQuestionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_ANSWER_VALUE);
        });

        it("❌ Tạch khi giá trị đáp án answer gửi lên là số thập phân", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.INVALID_ANSWER_VALUE_FLOAT(
                getSafeExamId(),
                getSafeSessionId(),
                getSafeQuestionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.INVALID_ANSWER_VALUE);
        });

        it("❌ Chặn đứng hành vi gian lận gửi đúp 2 đáp án cho cùng một câu hỏi", async () => {
          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(
              VALIDATE_ERRORS.DUPLICATE_QUESTION(
                getSafeExamId(),
                getSafeSessionId(),
                getSafeQuestionId(),
              ),
            );

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.SESSION.DUPLICATE_QUESTION);
        });
      });

      describe("🏆 Luồng Nghiệp vụ Chấm Điểm & Đóng Gói (Luồng xanh)", () => {
        it("✅ Học viên nộp bài thành công: Hệ thống tính điểm chuẩn và xóa sạch bộ nhớ tạm NoSQL Session", async () => {
          const payload = BASE_DATA(
            getSafeExamId(),
            getSafeSessionId(),
            getSafeQuestionId(),
          );

          const res = await request(app)
            .post(EXAM_ATTEMPT_ENDPOINTS.COMPLETE)
            .set(getAuthHeader(getRegularToken()))
            .send(payload);

          if (res.status !== 200) {
            console.error("Lỗi nộp bài luồng xanh chi tiết:", res.body);
          }

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe(Message.EXAM.COMPLETE_SUCCESS);
          expect(res.body.data).toBeDefined();
          const sendedHistoryId = res.body.data.historyId || res.body.data.id;
          if (sendedHistoryId) {
            setHistoryId(sendedHistoryId); // Bắn nó ra ngoài file tổng!
          }

          const checkSessionDeleted = await request(app)
            .get(ACTIVE_SESSION_ENDPOINTS.CURRENT)
            .set(getAuthHeader(getRegularToken()));

          expect(checkSessionDeleted.body.data).toBeNull();
        });
      });
    });
  });
};
