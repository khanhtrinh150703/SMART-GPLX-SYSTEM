// src/shared/config/payloads/exam.payload.ts

import { MOCK_UUID } from "../constants";

/**
 * @description Danh sách dữ liệu mẫu bao phủ toàn bộ các kịch bản của phân hệ EXAM.
 * Thiết kế Zero-Any, đóng băng dữ liệu nghiêm ngặt.
 */
export const EXAM_PAYLOAD = {
  // -------------------------------------------------------------------------
  // MẪU ĐẦU VÀO HỢP LỆ (HAPPY PATHS)
  // -------------------------------------------------------------------------
  VALID: {
    MANUAL_CREATE: {
      name: "Đề thi thử Hạng B2 - Bộ đề chuẩn 01",
      userId: MOCK_UUID,
      licenseCategoryId: MOCK_UUID,
      examMatrixId: MOCK_UUID,
      durationMinutes: 20,
      passingScore: 32,
      minCriticalQuestions: 1,
      isChapter: false,
      status: "ACTIVE",
      questionIds: [MOCK_UUID],
    },
    AUTO_GENERATE: {
      matrixId: MOCK_UUID,
      userId: MOCK_UUID,
      name: "Đề thi tự động sinh từ Ma trận Hạng C",
      status: "ACTIVE",
    },
    PARTIAL_UPDATE: {
      name: "Tên đề thi sau khi đã cập nhật thành công",
      durationMinutes: 25,
      passingScore: 34,
    },
  },

  // -------------------------------------------------------------------------
  // MẪU ĐẦU VÀO LỖI ĐỂ KIỂM TRA LỚP CÁC TRƯỜNG BIÊN (UNHAPPY / VALIDATION CASES)
  // -------------------------------------------------------------------------
  INVALID: {
    // Dữ liệu lỗi hệ thống chặn ngay tại cửa ngõ DTO Constructor
    DTO_LEVEL: {
      EMPTY_NAME: {
        name: "", // Gây lỗi NAME_REQUIRED
        userId: MOCK_UUID,
        licenseCategoryId: MOCK_UUID,
        questionIds: [MOCK_UUID],
        durationMinutes: 20,
        passingScore: 1,
        minCriticalQuestions: 0,
      },
      NAME_TOO_LONG: {
        name: "Đề thi có tên vượt quá một trăm ký tự quy định trong hàm validate của GenerateExamDTO".repeat(
          2,
        ), // Gây lỗi NAME_TOO_LONG
        matrixId: MOCK_UUID,
        userId: MOCK_UUID,
        status: "ACTIVE",
      },
      MISSING_USER: {
        name: "Đề thi hợp lệ tên",
        userId: "", // Gây lỗi USER_ID_REQUIRED
        licenseCategoryId: MOCK_UUID,
        questionIds: [MOCK_UUID],
        durationMinutes: 20,
        passingScore: 1,
        minCriticalQuestions: 0,
      },
      MISSING_LICENSE: {
        name: "Đề thi hợp lệ tên",
        userId: MOCK_UUID,
        licenseCategoryId: "", // Gây lỗi LICENSE_CATEGORY_REQUIRED
        questionIds: [MOCK_UUID],
        durationMinutes: 20,
        passingScore: 1,
        minCriticalQuestions: 0,
      },
      EMPTY_QUESTIONS: {
        name: "Đề thi thiếu câu hỏi",
        userId: MOCK_UUID,
        licenseCategoryId: MOCK_UUID,
        questionIds: [], // Rỗng -> Gây lỗi QUESTIONS_EMPTY
        durationMinutes: 20,
        passingScore: 1,
        minCriticalQuestions: 0,
      },
      ZERO_DURATION: {
        name: "Đề thi thời gian lỗi",
        userId: MOCK_UUID,
        licenseCategoryId: MOCK_UUID,
        questionIds: [MOCK_UUID],
        durationMinutes: 0, // Gây lỗi INVALID_DURATION
        passingScore: 1,
        minCriticalQuestions: 0,
      },
      SCORE_OVER_LIMIT: {
        name: "Đề thi điểm vượt trần",
        userId: MOCK_UUID,
        licenseCategoryId: MOCK_UUID,
        // Cố tình truyền 2 câu hỏi giả để tổng số = 2
        questionIds: [MOCK_UUID, "123e4567-e89b-12d3-a456-426614174000"],
        durationMinutes: 20,
        passingScore: 5, // Điểm đạt > 2 -> Gây lỗi PASSING_SCORE_TOO_HIGH
        minCriticalQuestions: 0,
      },
      NEGATIVE_CRITICAL: {
        name: "Đề thi điểm liệt âm",
        userId: MOCK_UUID,
        licenseCategoryId: MOCK_UUID,
        questionIds: [MOCK_UUID],
        durationMinutes: 20,
        passingScore: 1,
        minCriticalQuestions: -3, // Gây lỗi MIN_CRITICAL_INVALID
      },
      INVALID_TIME_RANGE: {
        startedAt: "2026-05-20T08:00:00.000Z",
        endedAt: "2026-05-20T07:00:00.000Z", // Gây lỗi INVALID_TIME_RANGE
      },
    },

    // Dữ liệu đúng định dạng DTO nhưng vi phạm các ràng buộc dữ liệu thực tế tại Service
    SERVICE_LEVEL: {
      NON_EXISTENT_ID: "00000000-0000-0000-0000-000000000000",
      FAKE_QUESTION_IDS: ["11111111-1111-1111-1111-111111111111"], // Chuyển sang UUID chuẩn để qua được DTO
      DUPLICATE_NAME: "Đề thi thử Hạng B2 - Bộ đề chuẩn 01",
      MATRIX_NOT_FOUND: {
        matrixId: "00000000-0000-4000-8000-000000000999", // UUID ảo gây lỗi 404 nghiệp vụ
        userId: "550e8400-e29b-41d4-a716-446655440000", // UUID chuẩn v4 để qua rào DTO
        name: "Đề thi lỗi sinh tự động do sai Ma trận",
        status: "ACTIVE",
      },
    },
  },
} as const;
