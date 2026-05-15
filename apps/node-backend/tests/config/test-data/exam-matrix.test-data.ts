/** @description Payload phục vụ kiểm thử Ma trận đề thi (Exam Matrix) */
export const EXAM_MATRIX_PAYLOAD = {
  // ==========================================
  // 1. TRƯỜNG HỢP HỢP LỆ (VALID CASES)
  // ==========================================
  CREATE_VALID: (
    licenseCategoryId: string,
    chapters: { id: string; percent: number; q: number }[],
  ) => ({
    licenseCategoryId,
    name: `Ma trận đề thi chuẩn ${new Date().getFullYear()}`,
    description: "Cấu trúc ma trận hợp lệ.",
    totalQuestions: chapters.reduce((sum, c) => sum + c.q, 0),
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: chapters.map((c) => ({
      chapterId: c.id,
      percentage: c.percent,
      numberOfQuestions: c.q,
    })),
  }),

  // ==========================================
  // 2. LỖI THÔNG TIN CƠ BẢN (BASIC INFO ERRORS)
  // ==========================================

  /** Thiếu trường bắt buộc (ErrorCode.SYSTEM.INVALID_INPUT) */
  MISSING_MANDATORY_FIELD: (licenseCategoryId: string) => ({
    licenseCategoryId,
    // Thiếu totalQuestions, passingScore, etc.
    name: "Ma trận thiếu field",
    isDefault: true,
    details: [],
  }),

  /** Tên trống (ErrorCode.MATRIX.NAME_REQUIRED) */
  EMPTY_NAME: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: "any", percentage: 100, numberOfQuestions: 30 }],
  }),

  /** Tên quá dài (ErrorCode.MATRIX.NAME_TOO_LONG) */
  NAME_TOO_LONG: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "A".repeat(101),
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: "any", percentage: 100, numberOfQuestions: 30 }],
  }),

  /** Thiếu ID hạng bằng (ErrorCode.VALIDATION.ID_REQUIRED) */
  MISSING_LICENSE_ID: () => ({
    licenseCategoryId: "",
    name: "Ma trận thiếu License ID",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: "any", percentage: 100, numberOfQuestions: 30 }],
  }),

  CRITICAL_INVALID: (licenseId: string, total: number, critical: number) => ({
    licenseCategoryId: licenseId,
    name: "Ma trận lỗi điểm liệt",
    totalQuestions: total,
    passingScore: Math.floor(total * 0.8),
    durationMinutes: 15,
    minCriticalQuestions: critical, // Test case sẽ truyền số âm hoặc > total
    isDefault: false,
    details: [
      { chapterId: "any-id", percentage: 100, numberOfQuestions: total },
    ],
  }),

  // ==========================================
  // 3. LỖI LOGIC CON SỐ (NUMERIC LOGIC ERRORS)
  // ==========================================

  /** Giá trị <= 0 (ErrorCode.SYSTEM.INVALID_INPUT) */
  INVALID_TOTAL_QUESTIONS: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Lỗi tổng số câu",
    totalQuestions: 0, // <--- Gây lỗi
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [],
  }),

  INVALID_PASSING_SCORE: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Lỗi điểm đạt",
    totalQuestions: 30,
    passingScore: 0, // <--- Gây lỗi
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [],
  }),

  INVALID_DURATION: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Lỗi thời lượng",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: -1, // <--- Gây lỗi
    minCriticalQuestions: 1,
    isDefault: true,
    details: [],
  }),

  /** Điểm đạt > Tổng câu (ErrorCode.MATRIX.INVALID_PASSING_SCORE) */
  PASSING_SCORE_TOO_HIGH: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Điểm đạt phi lý",
    totalQuestions: 30,
    passingScore: 31, // 31 > 30
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: "any", percentage: 100, numberOfQuestions: 30 }],
  }),

  // ==========================================
  // 4. LỖI CHI TIẾT CHƯƠNG (DETAILS ERRORS)
  // ==========================================

  /** Danh sách chi tiết rỗng (ErrorCode.MATRIX.NO_DETAILS) */
  EMPTY_DETAILS: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Ma trận không có chương",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [], // Lỗi
  }),

  /** Sai kiểu dữ liệu trong detail (ErrorCode.SYSTEM.INVALID_INPUT) */
  INVALID_DETAIL_DATA_TYPE: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Ma trận sai kiểu dữ liệu",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: 123, percentage: "100" }], // Lỗi type
  }),

  /** Tỷ trọng ngoài khoảng 0-100 (ErrorCode.MATRIX.INVALID_PERCENTAGE) */
  OUT_OF_RANGE_PERCENTAGE: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Phần trăm âm hoặc quá lớn",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [{ chapterId: "any", percentage: 101, numberOfQuestions: 30 }],
  }),

  /** Tổng tỷ trọng != 100% (ErrorCode.MATRIX.INVALID_PERCENTAGE) */
  TOTAL_PERCENT_NOT_100: (licenseCategoryId: string) => ({
    licenseCategoryId,
    name: "Tổng phần trăm sai",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterId: "c1", percentage: 50, numberOfQuestions: 15 },
      { chapterId: "c2", percentage: 40, numberOfQuestions: 12 },
      // Tổng mới có 90%
    ],
  }),

  /** Trùng lặp chương (ErrorCode.MATRIX.DUPLICATE_CHAPTER) */
  DUPLICATE_CHAPTER: (licenseCategoryId: string, chapterId: string) => ({
    licenseCategoryId,
    name: "Trùng chương",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterId: chapterId, percentage: 50, numberOfQuestions: 15 },
      { chapterId: chapterId, percentage: 50, numberOfQuestions: 15 },
    ],
  }),

  // Trong EXAM_MATRIX_PAYLOAD
  UPDATE_VALID: (chapters: { id: string; percent: number; q: number }[]) => {
    const totalQ = chapters.reduce((sum, c) => sum + c.q, 0);
    return {
      name: "Ma trận cập nhật",
      totalQuestions: totalQ,
      passingScore: Math.floor(totalQ * 0.8), // Luôn lấy 80% tổng số câu để đảm bảo hợp lệ
      durationMinutes: 20,
      minCriticalQuestions: 1,
      isDefault: true,
      details: chapters.map((c) => ({
        chapterId: c.id,
        percentage: c.percent,
        numberOfQuestions: c.q,
      })),
    };
  },

  UPDATE_LICENSE_CHANGE: (newLicenseId: string) => ({
    licenseCategoryId: newLicenseId, // Cố tình đổi sang ID khác
    name: "Cập nhật sai hạng bằng",
    totalQuestions: 25,
    passingScore: 21,
    durationMinutes: 19,
    minCriticalQuestions: 1,
    details: [{ chapterId: "any-id", percentage: 100, numberOfQuestions: 25 }],
  }),

  UPDATE_INVALID_PERCENTAGE: (chapterId: string, chapterIdSecond: string) => ({
    name: "Cập nhật sai tổng tỷ trọng",
    totalQuestions: 30,
    passingScore: 25,
    durationMinutes: 20,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterId, percentage: 60, numberOfQuestions: 18 },
      { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 9 },
    ],
  }),
} as const;
