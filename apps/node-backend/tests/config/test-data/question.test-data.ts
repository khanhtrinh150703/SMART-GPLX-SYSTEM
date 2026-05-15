// src/shared/config/payloads/question.payload.ts

/** * @description ID giả chuẩn cấu trúc UUIDv4 để vượt qua rào cản validation định dạng
 */
const MOCK_UUID = "00000000-0000-4000-8000-000000000999";

export const QUESTION_DATA = {
  // --- KỊCH BẢN HỢP LỆ (HAPPY PATHS) ---
  NORMAL_PAYLOAD: {
    content:
      "Khái niệm 'Phương tiện giao thông cơ giới đường bộ' được hiểu thế nào là đúng?",
    imageUrl: "https://example.com/images/question-1.png",
    isCritical: false,
    difficultyLevel: 1,
    indexNumber: 1,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID],
    answers: [
      {
        content: "Gồm xe ô tô; máy kéo; rơ moóc...",
        isCorrect: true,
        imageUrl: null,
      },
      {
        content: "Gồm xe gắn máy, xe đạp...",
        isCorrect: false,
        imageUrl: null,
      },
      {
        content: "Gồm xe xích lô, xe lăn...",
        isCorrect: false,
        imageUrl: null,
      },
    ],
  },

  CRITICAL_PAYLOAD: {
    content:
      "[CÂU ĐIỂM LIỆT] Người điều khiển phương tiện tham gia giao thông trong cơ thể có chất ma túy có bị nghiêm cấm hay không?",
    imageUrl: null,
    isCritical: true, // Đánh dấu câu điểm liệt
    difficultyLevel: 2,
    indexNumber: 2,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID, "00000000-0000-4000-8000-000000000111"],
    answers: [
      { content: "Bị nghiêm cấm", isCorrect: true, imageUrl: null },
      { content: "Không bị nghiêm cấm", isCorrect: false, imageUrl: null },
    ],
  },

  // --- KỊCH BẢN LỖI (VALIDATION/UNHAPPY PATHS) ---

  /** @description Lỗi: Nội dung quá ngắn (Giả sử min là 10 ký tự) */
  INVALID_CONTENT_SHORT: {
    content: "Ngắn quá",
    difficultyLevel: 1,
    isCritical: false,
    indexNumber: 3,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID],
    answers: [
      { content: "Đáp án hợp lệ A", isCorrect: true },
      { content: "Đáp án hợp lệ B", isCorrect: false },
    ],
  },

  /** @description Lỗi: Thiếu hạng bằng lái (Phải có ít nhất 1 ID) */
  MISSING_LICENSE: {
    content: "Nội dung câu hỏi này dài hơn 10 ký tự chắc chắn rồi.",
    licenseCategoryIds: [], // Rỗng -> Throw Error
    chapterId: MOCK_UUID,
    isCritical: false,
    difficultyLevel: 1,
    indexNumber: 4,
    answers: [
      { content: "Đáp án hợp lệ A", isCorrect: true },
      { content: "Đáp án hợp lệ B", isCorrect: false },
    ],
  },

  /** @description Lỗi: Không đủ số lượng đáp án (Phải có ít nhất 2) */
  INSUFFICIENT_ANSWERS: {
    content: "Câu hỏi này chỉ có duy nhất một đáp án thôi nè.",
    difficultyLevel: 1,
    indexNumber: 5,
    isCritical: false,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID],
    answers: [{ content: "Chỉ có mình em", isCorrect: true }],
  },

  /** @description Lỗi: Không có đáp án nào đúng (isCorrect toàn bộ là false) */
  NO_CORRECT_ANSWER: {
    content: "Câu hỏi này toàn đáp án sai, chọn kiểu gì bây giờ?",
    difficultyLevel: 1,
    indexNumber: 6,
    chapterId: MOCK_UUID,
    isCritical: false,
    licenseCategoryIds: [MOCK_UUID],
    answers: [
      { content: "Sai bét", isCorrect: false },
      { content: "Cũng sai luôn", isCorrect: false },
    ],
  },

  /** @description Lỗi: Có quá nhiều đáp án đúng (Nếu hệ thống chỉ cho phép 1) */
  MULTIPLE_CORRECT_ANSWERS: {
    content: "Câu hỏi này có tới tận hai đáp án đúng thì sao?",
    difficultyLevel: 1,
    indexNumber: 7,
    isCritical: false,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID],
    answers: [
      { content: "Đúng lần một", isCorrect: true },
      { content: "Đúng lần hai", isCorrect: true },
    ],
  },

  // --- KỊCH BẢN CẬP NHẬT ---
  UPDATE_PAYLOAD: {
    content: "[UPDATED] Nội dung đã được chỉnh sửa bởi Admin hệ thống",
    isCritical: false,
    difficultyLevel: 3,
    indexNumber: 1,
    chapterId: MOCK_UUID,
    licenseCategoryIds: [MOCK_UUID],
    answers: [
      { content: "Đáp án cũ được giữ lại", isCorrect: true, imageUrl: null },
      {
        content: "Đáp án mới toanh vừa thêm vào",
        isCorrect: false,
        imageUrl: "https://example.com/new-ans.png",
      },
    ],
  },
} as const;
