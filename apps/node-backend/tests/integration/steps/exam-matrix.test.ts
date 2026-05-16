import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "@/app";
import {
  ErrorCode,
  EXAM_MATRIX_ENDPOINTS,
  EXAM_MATRIX_PAYLOAD,
  fakeID,
} from "../../config/index";
import { DeleteType } from "@/domain/constants/delete.constant";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";

export const examMatrixSteps = (
  getAdminToken: () => string,
  getRegularToken: () => string,
  getLicenseId: () => string,
  getChapterId: () => string, // Chapter 1
  getChapterIdSecond: () => string, // Chapter 2
  getChapterIdThird: () => string, // Chapter 3
) => {
  let testMatrixId: string;

  const getAuthHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
  });

  const getValidChapters = () => [
    { id: getChapterId(), percent: 40, q: 12 },
    { id: getChapterIdSecond(), percent: 35, q: 11 },
    { id: getChapterIdThird(), percent: 25, q: 7 },
  ];

  describe("📂 Exam Matrix Management API Suite", () => {
    // ====================== TẠO MỚI MA TRẬN ======================

    describe("📝 Kịch bản: Tạo mới ma trận đề thi", () => {
      // Định nghĩa dữ liệu chương hợp lệ để tái sử dụng cho các test case thành công
      describe("🔐 Quyền truy cập & Luồng thành công", () => {
        it("🚫 Nên bị từ chối (403) khi User thường cố gắng tạo", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
            getLicenseId(),
            getValidChapters(),
          );
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getRegularToken()))
            .send(payload);

          expect(res.status).toBe(403);
          expect(res.body.success).toBe(false);
        });

        it("✅ Nên tạo thành công khi Admin gửi dữ liệu hợp lệ", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
            getLicenseId(),
            getValidChapters(),
          );
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBeDefined();
          testMatrixId = res.body.data.id; // Lưu lại để dùng cho Update/Delete
        });

        it("❌ Nên thất bại với mã lỗi 409 khi tạo trùng tên Ma trận đề thi", async () => {
          // CHỈ thay đổi số lượng câu hỏi 'q', GIỮ NGUYÊN mảng percent gốc để tổng không lệch quá 100% gây lỗi 400
          const differentChapters = getValidChapters().map((c, idx) =>
            idx === 0 ? { ...c, q: c.q + 10 } : c,
          );

          const payloadDuplicateName = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
            getLicenseId(),
            differentChapters,
          );

          // Gửi request, lúc này cấu hình hợp lệ nên sẽ vượt qua validator và xơi trọn quả lỗi 409 trùng tên
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payloadDuplicateName);

          expect(res.status).toBe(409);
          expect(res.body.success).toBe(false);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_ALREADY_EXISTS);
        });
      });

      describe("❌ Lỗi quan hệ dữ liệu (404 Not Found)", () => {
        it("❌ Nên trả về lỗi khi License Category không tồn tại", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
            fakeID,
            getValidChapters(),
          );
          // 🔥 Đổi tên để bypass qua bước 1 (Check trùng tên) của Service
          payload.name = `Ma trận test lỗi License ${Date.now()}`;

          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.LICENSE.NOT_FOUND);
        });

        it("❌ Nên trả về lỗi khi có Chapter không tồn tại trong DB", async () => {
          const invalidChapters = () => [{ id: fakeID, percent: 100, q: 30 }];
          const payload = EXAM_MATRIX_PAYLOAD.CREATE_VALID(
            getLicenseId(),
            invalidChapters(),
          );
          // 🔥 Đổi tên để tránh dính bẫy check trùng tên 409 của tầng Service trước khi kịp check Chapter
          payload.name = `Ma trận test lỗi Chapter ${Date.now()}`;

          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.CHAPTER.NOT_FOUND);
        });
      });

      describe("🛠 Lỗi ràng buộc dữ liệu & Logic (400/409)", () => {
        it("🚫 Nên lỗi khi để trống tên ma trận (MATRIX.NAME_REQUIRED)", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.EMPTY_NAME(getLicenseId());
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_REQUIRED);
        });

        it("🚫 Nên lỗi khi tên quá dài > 100 ký tự (MATRIX.NAME_TOO_LONG)", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.NAME_TOO_LONG(getLicenseId());
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_TOO_LONG);
        });

        it("🚫 Nên lỗi khi thiếu License ID (VALIDATION.ID_REQUIRED)", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.MISSING_LICENSE_ID();
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(
            ErrorCode.MATRIX.LICENSE_CATEGORY_REQUIRED,
          );
        });

        describe("📝 Kịch bản: Kiểm tra tính hợp lệ của các giá trị số", () => {
          const numericTestCases = [
            {
              label: "Tổng số câu <= 0",
              payload: EXAM_MATRIX_PAYLOAD.INVALID_TOTAL_QUESTIONS,
              expectedCode: ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS,
            },
            {
              label: "Điểm đạt <= 0",
              payload: EXAM_MATRIX_PAYLOAD.INVALID_PASSING_SCORE,
              expectedCode: ErrorCode.MATRIX.INVALID_PASSING_SCORE,
            },
            {
              label: "Thời lượng <= 0",
              payload: EXAM_MATRIX_PAYLOAD.INVALID_DURATION,
              expectedCode: ErrorCode.MATRIX.INVALID_DURATION,
            },
          ];

          it.each(numericTestCases)(
            "🚫 Nên lỗi khi $label",
            async ({ payload, expectedCode }) => {
              const res = await request(app)
                .post(EXAM_MATRIX_ENDPOINTS.BASE)
                .set(getAuthHeader(getAdminToken()))
                .send(payload(getLicenseId()));

              expect(res.status).toBe(400);
              expect(res.body.code).toBe(expectedCode);
            },
          );
        });

        it("🚫 Nên lỗi khi điểm đạt > tổng câu (MATRIX.INVALID_PASSING_SCORE)", async () => {
          const payload =
            EXAM_MATRIX_PAYLOAD.PASSING_SCORE_TOO_HIGH(getLicenseId());
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.PASSING_SCORE_TOO_HIGH);
        });

        it("🚫 Nên lỗi khi tổng phần trăm các chương != 100%", async () => {
          const payload =
            EXAM_MATRIX_PAYLOAD.TOTAL_PERCENT_NOT_100(getLicenseId());
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.TOTAL_PERCENTAGE_NOT_100);
        });

        it("🚫 Nên lỗi khi có chương bị trùng lặp (MATRIX.DUPLICATE_CHAPTER)", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.DUPLICATE_CHAPTER(
            getLicenseId(),
            getChapterId(),
          );
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          // 409 Conflict là mã phù hợp nhất cho dữ liệu trùng lặp
          expect(res.status).toBe(409);
          expect(res.body.code).toBe(ErrorCode.MATRIX.DUPLICATE_CHAPTER);
        });

        it("🚫 Nên lỗi khi mảng details rỗng (MATRIX.NO_DETAILS)", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.EMPTY_DETAILS(getLicenseId());
          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NO_DETAILS);
        });
        it("🚫 Nên lỗi khi số câu điểm liệt bị bỏ trống hoặc không phải là số (NaN)", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.CREATE_VALID(
              getLicenseId(),
              getValidChapters(),
            ),
            minCriticalQuestions: undefined, // Gây lỗi isNaN
          };

          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_REQUIRED);
        });

        it("🚫 Nên lỗi khi số câu điểm liệt tối thiểu là số âm", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.CREATE_VALID(
              getLicenseId(),
              getValidChapters(),
            ),
            minCriticalQuestions: -1, // Gây lỗi < 0
          };

          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_NEGATIVE);
        });

        it("🚫 Nên lỗi khi số câu điểm liệt (21) vượt quá tổng số câu hỏi (20)", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.CREATE_VALID(
              getLicenseId(),
              getValidChapters(),
            ),
            totalQuestions: 20,
            minCriticalQuestions: 21,
            passingScore: 15,
          };

          const res = await request(app)
            .post(EXAM_MATRIX_ENDPOINTS.CREATE)
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_TOO_HIGH);
        });
      });
    });

    describe("🔍 Kịch bản: Truy vấn danh sách ma trận", () => {
      it("✅ Nên lấy danh sách ma trận thành công (truy cập data.data)", async () => {
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        expect(Array.isArray(res.body.data.data)).toBe(true);
        expect(res.body.data.meta).toBeDefined();
      });

      // 1. Lọc theo Tên ma trận (name)
      it("✅ Nên lọc được ma trận theo Tên (name) - Tìm kiếm gần đúng", async () => {
        const filterName = "Ma trận chuẩn";
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ name: filterName })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          // Dùng toContain vì thường name sẽ tìm theo kiểu LIKE %...%
          expect(matrix.name.toLowerCase()).toContain(filterName.toLowerCase());
        });
      });

      // 2. Lọc theo Tên hạng bằng (licenseCategoryName)
      it("✅ Nên lọc chính xác ma trận thuộc hạng bằng: B2", async () => {
        const filterLicense = "B2";
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ licenseCategoryName: filterLicense })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          expect(matrix.licenseCategoryName).toBe(filterLicense);
        });
      });

      // 3. Lọc theo Tổng số câu hỏi (totalQuestions)
      it("✅ Nên lọc được các ma trận có tổng số câu hỏi là 35", async () => {
        const filterTotal = 35;
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ totalQuestions: filterTotal })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          expect(Number(matrix.totalQuestions)).toBe(filterTotal);
        });
      });

      // 4. Lọc theo Điểm đạt (passingScore)
      it("✅ Nên lọc được các ma trận có điểm đạt là 32", async () => {
        const filterScore = 32;
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ passingScore: filterScore })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          expect(Number(matrix.passingScore)).toBe(filterScore);
        });
      });

      // 5. Lọc theo Thời gian làm bài (durationMinutes)
      it("✅ Nên lọc được các ma trận có thời gian thi là 20 phút", async () => {
        const filterDuration = 20;
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ durationMinutes: filterDuration })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          expect(Number(matrix.durationMinutes)).toBe(filterDuration);
        });
      });

      // 6. Lọc theo Số câu điểm liệt (minCriticalQuestions)
      it("✅ Nên lọc được các ma trận yêu cầu tối thiểu 1 câu điểm liệt", async () => {
        const filterCritical = 1;
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ minCriticalQuestions: filterCritical })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        res.body.data.data.forEach((matrix: ExamMatrixResponseDTO) => {
          expect(Number(matrix.minCriticalQuestions)).toBe(filterCritical);
        });
      });

      it("✅ Nên phân trang đúng khi truyền limit=2 và page=1", async () => {
        const params = { limit: 2, page: 1, licenseCategoryId: getLicenseId() };

        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query(params)
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);

        expect(res.body.data.data.length).toBeLessThanOrEqual(params.limit);
        expect(res.body.data.meta.page).toBe(params.page);
        expect(res.body.data.meta.limit).toBe(params.limit);
      });

      it("✅ Nên trả về danh sách rỗng khi page vượt quá tổng số trang", async () => {
        const res = await request(app)
          .get(EXAM_MATRIX_ENDPOINTS.BASE)
          .query({ page: 999, limit: 10 })
          .set(getAuthHeader(getAdminToken()));

        expect(res.status).toBe(200);
        expect(res.body.data.data.length).toBe(0);
      });
    });

    // ====================== CẬP NHẬT MA TRẬN ======================
    describe("📝 Kịch bản: Cập nhật ma trận đề thi", () => {
      describe("📝 Kịch bản: Kiểm tra tính hợp lệ của các giá trị số", () => {
        const numericTestCases = [
          {
            label: "Tổng số câu <= 0",
            payload: EXAM_MATRIX_PAYLOAD.INVALID_TOTAL_QUESTIONS,
            expectedCode: ErrorCode.MATRIX.INVALID_TOTAL_QUESTIONS,
          },
          {
            label: "Điểm đạt <= 0",
            payload: EXAM_MATRIX_PAYLOAD.INVALID_PASSING_SCORE,
            expectedCode: ErrorCode.MATRIX.INVALID_PASSING_SCORE,
          },
          {
            label: "Thời lượng <= 0",
            payload: EXAM_MATRIX_PAYLOAD.INVALID_DURATION,
            expectedCode: ErrorCode.MATRIX.INVALID_DURATION,
          },
        ];

        it.each(numericTestCases)(
          "🚫 Nên lỗi khi $label",
          async ({ payload, expectedCode }) => {
            const res = await request(app)
              .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
              .set(getAuthHeader(getAdminToken()))
              .send(payload(getLicenseId()));

            expect(res.status).toBe(400);
            expect(res.body.code).toBe(expectedCode);
          },
        );
      });

      const getUpdateChapters = () => [
        { id: getChapterId(), percent: 50, q: 15 },
        { id: getChapterIdSecond(), percent: 50, q: 15 },
      ];

      describe("🔐 Quyền truy cập & Luồng thành công", () => {
        it("🚫 Nên bị từ chối (403) khi User thường cố gắng cập nhật", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId)) // testMatrixId lấy từ case Create thành công
            .set(getAuthHeader(getRegularToken()))
            .send(payload);

          expect(res.status).toBe(403);
        });

        it("✅ Nên cập nhật thành công khi Admin gửi dữ liệu hợp lệ", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe(payload.name);
          expect(res.body.data.totalQuestions).toBe(30);
        });
      });

      describe("❌ Lỗi định danh & Tồn tại (404)", () => {
        it("❌ Nên trả về lỗi 404 khi ID ma trận không tồn tại trong hệ thống", async () => {
          const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters());

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(fakeID)) // ID không tồn tại
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
        });
      });

      describe("🛠 Lỗi logic nghiệp vụ (Dựa trên isValid)", () => {
        it("🚫 Nên lỗi khi cập nhật tên quá dài > 100 ký tự", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            name: "A".repeat(101),
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NAME_TOO_LONG);
        });

        it("🚫 Nên lỗi khi điểm đạt mới cao hơn tổng số câu hỏi mới", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            totalQuestions: 20,
            passingScore: 25, // 25 > 20
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.INVALID_PASSING_SCORE);
        });

        it("🚫 Nên lỗi khi tổng phần trăm sau khi cập nhật không bằng 100%", async () => {
          const invalidChapters = [
            { id: getChapterId(), percent: 30, q: 10 },
            { id: getChapterIdSecond(), percent: 30, q: 10 }, // Tổng 60%
          ];
          const payload = EXAM_MATRIX_PAYLOAD.UPDATE_VALID(invalidChapters);

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.TOTAL_PERCENTAGE_NOT_100);
        });

        it("🚫 Nên lỗi khi gửi danh sách chương (details) rỗng", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            details: [],
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NO_DETAILS);
        });

        it("🚫 Nên lỗi khi có giá trị phần trăm chương <= 0", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            details: [
              {
                chapterId: getChapterId(),
                percentage: 0,
                numberOfQuestions: 0,
              },
            ],
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(
            ErrorCode.MATRIX.CHAPTER_PERCENTAGE_OUT_OF_RANGE,
          );
        });
      });
      describe("🛠 Kiểm tra logic Câu hỏi điểm liệt khi Cập nhật", () => {
        it("🚫 Nên lỗi khi cập nhật số câu điểm liệt bị bỏ trống hoặc là NaN", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            minCriticalQuestions: undefined, // Gây lỗi isNaN
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_REQUIRED);
        });

        it("🚫 Nên lỗi khi cập nhật số câu điểm liệt là số âm", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            minCriticalQuestions: -5, // Gây lỗi < 0
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_NEGATIVE);
        });

        it("🚫 Nên lỗi khi cập nhật số câu điểm liệt (35) lớn hơn tổng số câu (30)", async () => {
          const payload = {
            ...EXAM_MATRIX_PAYLOAD.UPDATE_VALID(getUpdateChapters()),
            totalQuestions: 30,
            minCriticalQuestions: 35, // Gây lỗi logic: 35 > 30
          };

          const res = await request(app)
            .put(EXAM_MATRIX_ENDPOINTS.UPDATE(testMatrixId))
            .set(getAuthHeader(getAdminToken()))
            .send(payload);

          expect(res.status).toBe(400);
          expect(res.body.code).toBe(ErrorCode.MATRIX.MIN_CRITICAL_TOO_HIGH);
        });
      });
    });

    // ====================== XÓA MA TRẬN ======================
    describe("🗑️ Kịch bản: Xóa ma trận", () => {
      it("✅ Admin xóa ma trận thành công (hard delete)", async () => {
        if (!testMatrixId) return;

        const res = await request(app)
          .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
          .set(getAuthHeader(getAdminToken()));

        expect(res.body.data).toMatchObject({ type: DeleteType.HARD });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      describe("🗑️ Kịch bản: Xóa ma trận đề thi", () => {
        it("❌ Nên trả về lỗi 404 khi cố xóa một Exam Matrix ID không tồn tại (Fake ID)", async () => {
          const res = await request(app)
            .delete(EXAM_MATRIX_ENDPOINTS.DELETE(fakeID))
            .set(getAuthHeader(getAdminToken()));

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
        });

        it("❌ Nên trả về lỗi 404 khi cố xóa lại một ma trận đã bị xóa trước đó", async () => {
          // Lần 1: Xóa thành công (giả định testMatrixId lấy từ bài test tạo mới trước đó)
          await request(app)
            .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
            .set(getAuthHeader(getAdminToken()));

          // Lần 2: Cố tình xóa lại chính ID đó
          const res = await request(app)
            .delete(EXAM_MATRIX_ENDPOINTS.DELETE(testMatrixId))
            .set(getAuthHeader(getAdminToken()));

          expect(res.status).toBe(404);
          expect(res.body.code).toBe(ErrorCode.MATRIX.NOT_FOUND);
        });
      });
    });

    // // ====================== KHÔI PHỤC MA TRẬN ======================
    // describe('♻️ Kịch bản: Khôi phục ma trận', () => {

    //     it('✅ Admin khôi phục ma trận đã xóa mềm thành công', async () => {
    //         if (!testMatrixId) return;

    //         const res = await request(app)
    //             .patch(EXAM_MATRIX_ENDPOINTS.RESTORE(testMatrixId))
    //             .set(getAuthHeader(getAdminToken()));

    //         expect(res.status).toBe(200);
    //         expect(res.body.success).toBe(true);
    //     });

    //     it('🚫 Nên trả về lỗi khi khôi phục gây trùng lặp ma trận hoạt động', async () => {
    //         if (!testMatrixId) return;

    //         const res = await request(app)
    //             .patch(EXAM_MATRIX_ENDPOINTS.RESTORE(testMatrixId))
    //             .set(getAuthHeader(getAdminToken()));

    //         expect(res.status).toBe(400);
    //         expect(res.body.code).toBe('MATRIX_RESTORE_FAILED_DUPLICATE');
    //     });
    // });
  });
};
