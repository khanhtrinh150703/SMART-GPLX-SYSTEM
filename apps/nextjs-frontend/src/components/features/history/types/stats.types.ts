export interface IUserStatistics {
  // --- EXAM OVERVIEW (Tổng quan bài thi) ---
  totalExams: number;
  passedExams: number;
  failedExams: number;
  failedByCritical: number; // Trượt do sai câu điểm liệt
  passRate: number; // Tỷ lệ đạt (%)

  // --- QUESTIONS & ACCURACY (Câu hỏi & Độ chính xác) ---
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalUnanswered: number;
  accuracyRate: number; // Tỷ lệ chính xác (%)
  fastestDuration: number;
  fastestExamName: string;

  // --- PERFORMANCE (Hiệu suất) ---
  averageScore: number;
  averageDuration: number;
  highScore: number;
  currentStreak: number;
  maxStreak: number;
  currentRank: string | null;
  lastExamAt: Date | string;
}
