import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { cleanupDB, connectDB } from "../jest.setup";
import {
  AUTH_PAYLOAD,
  AUTH_ENDPOINTS,
  CHAPTER_ENDPOINTS,
  LICENSE_ENDPOINTS,
  EXAM_MATRIX_ENDPOINTS,
  EXAM_ENDPOINTS,
} from "../config/index";
import request from "supertest";
import app from "@/app";
import { examMatrixSteps } from "./steps/exam-matrix.test";
import { Chapter, Exam, ExamMatrix, LicenseCategory } from "@prisma/client";
import {
  activeSessionSteps,
  authSteps,
  chapterSteps,
  examAttemptSteps,
  examHistorySteps,
  examSteps,
  licenseSteps,
  questionSteps,
  selectionSteps,
  userStatisticsSteps,
  userSteps,
} from "./steps";
import prisma from "../../prisma/prisma";

describe("🏁 FULL SYSTEM INTEGRATION TEST FLOW", () => {
  // Shared Context: Dữ liệu dùng chung xuyên suốt các file
  let adminToken: string;
  let regularToken: string;
  let chapterId: string | undefined;
  let chapterIdSecond: string | undefined;
  let chapterIdThird: string | undefined;
  let chapterIdFour: string | undefined;
  let licenseId: string | undefined;
  let licenseSecond: string | undefined;
  let examMatrixId: string | undefined;
  let examId: string | undefined;
  let anotherExamId: string | undefined;
  let activeSessionId: string | undefined;
  let validQuestionId: string | undefined;
  let historyId: string | undefined;
  let studentId: string | undefined;
  let tearcherId: string | undefined;

  // --- 🔑 SETUP: Khởi động, lấy Token và Dữ liệu nền ---
  beforeAll(async () => {
    // Kết nối Database 1 lần duy nhất
    await connectDB();

    const login = async (
      credentials: { username: string; password: string },
      roleName: string,
    ): Promise<string> => {
      const res = await request(app)
        .post(AUTH_ENDPOINTS.LOGIN)
        .send(credentials);

      if (res.status !== 200) {
        console.error(`❌ [${roleName} Setup]: Login Failed!`, res.body);
        throw new Error(`Dừng test: Không thể lấy token cho ${roleName}.`);
      }

      return res.body.data.accessToken;
    };

    // 1. Tối ưu hóa đăng nhập song song (Parallelism) để tăng tốc độ chạy Test Suite
    const [fetchedAdminToken, fetchedRegularToken] = await Promise.all([
      login(
        {
          username: AUTH_PAYLOAD.ADMIN_ACCOUNT.username,
          password: AUTH_PAYLOAD.ADMIN_ACCOUNT.password,
        },
        "Admin",
      ),
      login(
        {
          username: AUTH_PAYLOAD.NORMAL_ACCOUNT.username,
          password: AUTH_PAYLOAD.NORMAL_ACCOUNT.password,
        },
        "Regular User",
      ),
    ]);

    adminToken = fetchedAdminToken;
    regularToken = fetchedRegularToken;

    // 2. Fetch dữ liệu từ API và truy vấn trực tiếp từ DB SONG SONG (Parallelism 100%)
    const [
      chapterRes,
      licenseRes,
      examMatrixRes,
      examRes,
      rawStudent,
      rawTeacher,
    ] = await Promise.all([
      request(app)
        .get(CHAPTER_ENDPOINTS.FETCH_ALL)
        .set("Authorization", `Bearer ${adminToken}`),
      request(app)
        .get(`${LICENSE_ENDPOINTS.BASE}?limit=100`)
        .set("Authorization", `Bearer ${adminToken}`),
      request(app)
        .get(EXAM_MATRIX_ENDPOINTS.BASE)
        .set("Authorization", `Bearer ${adminToken}`),
      request(app)
        .get(EXAM_ENDPOINTS.LIST_PRIVATE)
        .set("Authorization", `Bearer ${adminToken}`),

      // Đứng từ bảng roles lấy thẳng bản ghi, không vòng vo qua bảng khác
      prisma.role.findFirst({
        where: { name: "STUDENT" }, 
        select: { id: true },
      }),

      prisma.role.findFirst({
        where: { name: "INSTRUCTOR" },
        select: { id: true },
      }),
    ]);

    studentId = rawStudent?.id;
    tearcherId = rawTeacher?.id;

    // 3. Ép kiểu dữ liệu (Cast type) chuẩn xác để không bị dính 'any' ngầm
    const chapters = (chapterRes.body.data?.data || []) as Chapter[];
    const licenses = (licenseRes.body.data?.data || []) as LicenseCategory[];
    const examMatrix = (examMatrixRes.body.data?.data || []) as ExamMatrix[];
    const exams = (examRes.body.data?.data || []) as Exam[];

    const getChapter = (code: string): string | undefined =>
      chapters.find((c: Chapter) => c.code === code)?.id;
    const getLicense = (name: string): string | undefined =>
      licenses.find((l: LicenseCategory) => l.name === name)?.id;
    const getexamMatrix = (name: string): string | undefined =>
      examMatrix.find((ex: ExamMatrix) => ex.name === name)?.id;
    const getExam = (name: string): string | undefined =>
      exams.find((e: Exam) => e.name === name)?.id;

    // 4. Tìm kiếm ID danh mục chính xác theo nghiệp vụ sát hạch
    chapterId = getChapter("CH01");
    chapterIdSecond = getChapter("CH05");
    chapterIdThird = getChapter("CH06");
    chapterIdFour = getChapter("CH07");

    licenseId = getLicense("CE");
    licenseSecond = getLicense("I");
    examMatrixId = getexamMatrix("Ma trận chuẩn Hạng CE");

    examId = getExam("Đề thi mẫu Hạng A1 - Số 01");
    anotherExamId = getExam("Đề thi mẫu Hạng A1 - Số 02");

    // 5. Mệnh đề bảo vệ nghiêm ngặt (Guard Clause) kiểm tra toàn diện dữ liệu test
    if (
      !chapterId ||
      !chapterIdSecond ||
      !licenseId ||
      !examMatrixId ||
      !examId ||
      !anotherExamId ||
      !studentId || // Bắt buộc phải có studentId mới cho chạy test
      !tearcherId // Bắt buộc phải có tearcherId mới cho chạy test
    ) {
      throw new Error(
        `❌ Test Fail: Thiếu dữ liệu Seed Data nền! Chi tiết: ` +
          `Chapter1: ${!!chapterId}, Chapter2: ${!!chapterIdSecond}, License: ${!!licenseId}, ` +
          `Matrix: ${!!examMatrixId}, Exam1: ${!!examId}, Exam2: ${!!anotherExamId}, ` +
          `Student: ${!!studentId}, Teacher: ${!!tearcherId}`,
      );
    }
  });
  // =========================================================================
  // THỰC THI CÁC GIAI ĐOẠN (SEQUENTIAL EXECUTION)
  // =========================================================================

  describe("Phase 1: Authentication Operations", () => {
    authSteps();
  });

  describe("Phase 2: User Operations", () => {
    // Gọi hàm thiết lập kịch bản chạy test, truyền token factory và object factory chứa 2 ID
    userSteps(
      () => adminToken,
      () => studentId as string,
      () => tearcherId as string,
    );
  });

  describe("Phase 3: License Operations", () => {
    licenseSteps(
      () => adminToken,
      () => regularToken,
      () => licenseId as string,
      () => licenseSecond as string,
    );
  });

  describe("Phase 4: Chapter Operations", () => {
    chapterSteps(
      () => adminToken,
      () => regularToken,
      () => chapterId as string,
      () => chapterIdFour as string,
    );
  });

  describe("Phase 5: Question Operations", () => {
    questionSteps(
      () => adminToken,
      () => regularToken,
      () => chapterId as string,
      () => licenseId as string,
    );
  });

  describe("Phase 6: Selection Operations", () => {
    selectionSteps(
      () => adminToken,
      () => regularToken,
    );
  });

  describe("Phase 7: Exam-Matrix Operations", () => {
    examMatrixSteps(
      () => adminToken,
      () => regularToken,
      () => licenseId as string,
      () => chapterId as string,
      () => chapterIdSecond as string,
      () => chapterIdThird as string,
    );
  });

  describe("Phase 8: Exam Operations", () => {
    examSteps(
      () => adminToken,
      () => regularToken,
      () => licenseId as string,
      () => examMatrixId as string,
    );
  });

  describe("Phase 9: Active-Session Integration Operations", () => {
    activeSessionSteps(
      () => regularToken,
      () => examId as string,
      () => anotherExamId as string,
      (id) => {
        activeSessionId = id;
      },
      (qId) => {
        validQuestionId = qId;
      },
    );
  });

  describe("Phase 10: Exam-Attempt (Complete) Integration Operations", () => {
    examAttemptSteps(
      () => regularToken,
      () => examId as string,
      () => activeSessionId as string,
      () => validQuestionId as string,
      (id) => {
        historyId = id;
      },
    );
  });

  // =========================================================================
  // PHASE 11: TRUY VẤN LỊCH SỬ THI (MYSQL SUMMARY & NOSQL SNAPSHOT)
  // =========================================================================
  describe("Phase 11: Exam-History Summary & Detail Operations", () => {
    examHistorySteps(
      () => regularToken,
      () => historyId as string,
    );
  });

  // =========================================================================
  // PHASE 12: THỐNG KÊ TIẾN ĐỘ & ĐỒNG BỘ DATA (ADMIN & USER SCOPE)
  // =========================================================================
  describe("Phase 12: User Statistics & Admin Sync Operations", () => {
    userStatisticsSteps(
      () => adminToken,
      () => regularToken,
    );
  });

  // =========================================================================
  // GIAI ĐOẠN CUỐI: ĐĂNG XUẤT (TEARDOWN & LOGOUT)
  // =========================================================================
  describe("Final Phase: Logout & Cleanup Session", () => {
    it("✅ Nên đăng xuất thành công và vô hiệu hóa session của Admin", async () => {
      const res = await request(app)
        .post(AUTH_ENDPOINTS.LOGOUT)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("✅ Nên bị từ chối (401) nếu cố gắng truy cập sau khi đã đăng xuất", async () => {
      const res = await request(app)
        .get(LICENSE_ENDPOINTS.BASE)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(401);
    });
  });

  // =========================================================================
  // DỌN DẸP DATABASE
  // =========================================================================
  afterAll(async () => {
    console.log("✅ Teardown hoàn tất: Database đã được dọn dẹp.");
    await cleanupDB();
  }, 30000);
});
