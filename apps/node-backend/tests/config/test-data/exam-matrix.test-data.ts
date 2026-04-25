/** @description Payload phục vụ kiểm thử Ma trận đề thi (Exam Matrix) */
export const EXAM_MATRIX_PAYLOAD = {
    CREATE_VALID: (
        licenseCategoryId: string,
        chapterId: string,
        chapterIdSecond: string,
        chapterIdThird: string
    ) => ({
        licenseCategoryId,
        name: `Ma trận đề thi lý thuyết ${new Date().getFullYear()}`,
        description: 'Cấu trúc ma trận đề thi chuẩn cho hạng bằng lái xe.',
        totalQuestions: 30,
        passingScore: 25,
        durationMinutes: 20,
        minCriticalQuestions: 1,
        isDefault: true,
        details: [
            { chapterId, percentage: 40, numberOfQuestions: 12 },
            { chapterId: chapterIdSecond, percentage: 35, numberOfQuestions: 11 },
            { chapterId: chapterIdThird, percentage: 25, numberOfQuestions: 7 },
        ],
    }),

    CREATE_INVALID_PERCENTAGE: (licenseCategoryId: string, chapterId: string, chapterIdSecond: string) => ({
        licenseCategoryId,
        name: 'Ma trận lỗi phần trăm',
        description: 'Tổng phần trăm details không bằng 100%.',
        totalQuestions: 30,
        passingScore: 25,
        durationMinutes: 20,
        minCriticalQuestions: 1,
        isDefault: true,
        details: [
            { chapterId, percentage: 50, numberOfQuestions: 15 },
            { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 9 },
        ],
    }),

    CREATE_DUPLICATE_CHAPTER: (licenseCategoryId: string, chapterId: string) => ({
        licenseCategoryId,
        name: 'Ma trận trùng chương',
        description: 'Kiểm tra lỗi khi một chương xuất hiện nhiều lần.',
        totalQuestions: 30,
        passingScore: 25,
        durationMinutes: 20,
        minCriticalQuestions: 1,
        isDefault: true,
        details: [
            { chapterId, percentage: 40, numberOfQuestions: 12 },
            { chapterId, percentage: 60, numberOfQuestions: 18 },
        ],
    }),

    CREATE_NO_DETAILS: (licenseCategoryId: string) => ({
        licenseCategoryId,
        name: 'Ma trận thiếu chi tiết',
        description: 'Kiểm tra lỗi khi mảng details bị rỗng.',
        totalQuestions: 30,
        passingScore: 25,
        durationMinutes: 20,
        minCriticalQuestions: 1,
        isDefault: true,
        details: [],
    }),

    UPDATE_VALID: (
        chapterId: string,
        chapterIdSecond: string,
        chapterIdThird: string
    ) => ({
        name: 'Ma trận đề thi (Updated)',
        description: 'Phiên bản cập nhật dữ liệu năm 2026.',
        totalQuestions: 35,
        passingScore: 28,
        durationMinutes: 20,
        minCriticalQuestions: 1,
        isDefault: true,
        details: [
            { chapterId, percentage: 45, numberOfQuestions: 16 },
            { chapterId: chapterIdSecond, percentage: 30, numberOfQuestions: 10 },
            { chapterId: chapterIdThird, percentage: 25, numberOfQuestions: 9 },
        ],
    }),

    UPDATE_INVALID_PERCENTAGE: (chapterId: string, chapterIdSecond: string) => ({
        name: 'Cập nhật sai tổng tỷ trọng',
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