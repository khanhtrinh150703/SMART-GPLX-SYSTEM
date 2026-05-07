export const QUESTION_DATA = {
  NORMAL_PAYLOAD: {
    content: "Khái niệm 'Phương tiện giao thông cơ giới đường bộ' được hiểu thế nào là đúng?",
    imageUrl: 'https://example.com/images/question-1.png',
    isCritical: false,
    difficultyLevel: 1,
    indexNumber: 0,
    answers: [
      { content: 'Gồm xe ô tô; máy kéo; rơ moóc...', isCorrect: true, imageUrl: null },
      { content: 'Gồm xe gắn máy, xe đạp...', isCorrect: false, imageUrl: null },
    ],
  },

  CRITICAL_PAYLOAD: {
    content: "[CÂU ĐIỂM LIỆT] Người điều khiển phương tiện tham gia giao thông trong cơ thể có chất ma túy có bị nghiêm cấm hay không?",
    imageUrl: null,
    isCritical: true,
    difficultyLevel: 2,
    indexNumber: 0,
    answers: [
      { content: 'Bị nghiêm cấm', isCorrect: true },
      { content: 'Không bị nghiêm cấm', isCorrect: false },
    ],
  },

  INVALID_CONTENT_SHORT: {
    content: 'Ngắn quá',
    difficultyLevel: 1,
    indexNumber: 0,
    answers: [
      { content: 'Đáp án A', isCorrect: true },
      { content: 'Đáp án B', isCorrect: false },
    ],
  },

  MISSING_LICENSE: {
    content: 'Nội dung câu hỏi này dài hơn 10 ký tự chắc chắn rồi.',
    licenseCategoryIds: [],
    difficultyLevel: 1,
    indexNumber: 0,
    answers: [
      { content: 'Đáp án A', isCorrect: true },
      { content: 'Đáp án B', isCorrect: false },
    ],
  },

  INSUFFICIENT_ANSWERS: {
    content: 'Câu hỏi này chỉ có duy nhất một đáp án thôi nè.',
    difficultyLevel: 1,
    indexNumber: 0,
    answers: [{ content: 'Chỉ có mình em', isCorrect: true }],
  },

  NO_CORRECT_ANSWER: {
    content: 'Câu hỏi này toàn đáp án sai, chọn kiểu gì bây giờ?',
    difficultyLevel: 1,
    indexNumber: 0,
    answers: [
      { content: 'Sai bét', isCorrect: false },
      { content: 'Cũng sai luôn', isCorrect: false },
    ],
  },

  UPDATE_PAYLOAD: {
    content: '[UPDATED] Nội dung đã được chỉnh sửa bởi Admin',
    isCritical: false,
    difficultyLevel: 3,
    indexNumber: 0,
    answers: [
      { content: 'Đáp án cũ được giữ lại', isCorrect: true, imageUrl: null },
      { content: 'Đáp án mới toanh vừa thêm vào', isCorrect: false, imageUrl: 'https://example.com/new-ans.png' },
    ],
  },
} as const;