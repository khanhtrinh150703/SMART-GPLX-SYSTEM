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

    // 1. Đăng nhập song song hoặc tuần tự
    adminToken = await login(
      {
        username: AUTH_PAYLOAD.ADMIN_ACCOUNT.username,
        password: AUTH_PAYLOAD.ADMIN_ACCOUNT.password,
      },
      "Admin",
    );

    regularToken = await login(
      {
        username: AUTH_PAYLOAD.NORMAL_ACCOUNT.username,
        password: AUTH_PAYLOAD.NORMAL_ACCOUNT.password,
      },
      "Regular User",
    );

    // 2. Fetch dữ liệu từ API
    const [chapterRes, licenseRes, examMatrixRes, examRes] = await Promise.all([
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
    ]);

    // 3. Ép kiểu dữ liệu (Cast type) để không phải dùng any
    const chapters = (chapterRes.body.data?.data || []) as Chapter[];
    const licenses = (licenseRes.body.data?.data || []) as LicenseCategory[];
    const examMatrix = (examMatrixRes.body.data?.data || []) as ExamMatrix[];
    const exams = (examRes.body.data?.data || []) as Exam[];

    const getChapter = (code: string) =>
      chapters.find((c: Chapter) => c.code === code)?.id;
    const getLicense = (name: string) =>
      licenses.find((l: LicenseCategory) => l.name === name)?.id;
    const getexamMatrix = (name: string) =>
      examMatrix.find((ex: ExamMatrix) => ex.name === name)?.id;
    const getExam = (name: string) =>
      exams.find((e: Exam) => e.name === name)?.id;

    // 4. Tìm kiếm ID chính xác theo nghiệp vụ
    chapterId = getChapter("CH01");
    chapterIdSecond = getChapter("CH05");
    chapterIdThird = getChapter("CH06");
    chapterIdFour = getChapter("CH07");

    licenseId = getLicense("CE");
    licenseSecond = getLicense("I");
    examMatrixId = getexamMatrix("Ma trận chuẩn Hạng CE");

    examId = getExam("Đề thi mẫu Hạng A1 - Số 01");
    anotherExamId = getExam("Đề thi mẫu Hạng A1 - Số 02"); // 💡 Bốc thêm ID đề mẫu số 02

    // 5. Kiểm tra an toàn (Guard Clause)
    if (
      !chapterId ||
      !chapterIdSecond ||
      !licenseId ||
      !examMatrixId ||
      !examId ||
      !anotherExamId // 💡 Thêm check chặt chẽ cho anotherExamId
    ) {
      throw new Error(
        "❌ Test Fail: Không tìm thấy Seed Data cho các trường danh mục hoặc Đề thi mẫu",
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
    userSteps(() => adminToken);
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
