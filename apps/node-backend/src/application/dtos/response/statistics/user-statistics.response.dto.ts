/**
 * @description Giao diện dữ liệu trả về cho thông tin thống kê tổng quát.
 * Bao gồm đầy đủ các chỉ số về hiệu suất, thời gian và kỷ lục cá nhân.
 */
export interface IUserStatisticsResponseDTO {
  // --- EXAM OVERVIEW ---
  readonly totalExams: number;
  readonly passedExams: number;
  readonly failedExams: number;
  readonly failedByCritical: number; // Trượt do câu điểm liệt
  readonly passRate: number; // Tỷ lệ đạt (%)

  // --- QUESTIONS & ACCURACY ---
  readonly totalQuestionsAnswered: number;
  readonly totalCorrectAnswers: number;
  readonly totalWrongAnswers: number;
  readonly totalUnanswered: number;
  readonly accuracyRate: number; // Tỷ lệ chính xác (%)

  // --- SCORES ---
  readonly averageScore: number;
  readonly highScore: number;
  readonly lowScore: number;

  // --- DURATION (Seconds) ---
  readonly averageDuration: number;
  readonly fastestDuration: number;
  readonly slowestDuration: number;

  // --- PERFORMANCE & RANKING ---
  readonly currentStreak: number;
  readonly maxStreak: number;
  readonly currentRank: string | null;

  // --- RECORDS & METADATA ---
  readonly highScoreExamName: string | null;
  readonly fastestExamName: string | null;
  readonly lastExamAt: Date | null;
}

/**
 * @description DTO vận chuyển thông tin thống kê người dùng.
 * Đảm bảo tính nhất quán giữa dữ liệu Persistence (Prisma) và UI.
 */
export class UserStatisticsResponseDTO implements IUserStatisticsResponseDTO {
  public readonly totalExams: number;
  public readonly passedExams: number;
  public readonly failedExams: number;
  public readonly failedByCritical: number;
  public readonly passRate: number;

  public readonly totalQuestionsAnswered: number;
  public readonly totalCorrectAnswers: number;
  public readonly totalWrongAnswers: number;
  public readonly totalUnanswered: number;
  public readonly accuracyRate: number;

  public readonly averageScore: number;
  public readonly highScore: number;
  public readonly lowScore: number;

  public readonly averageDuration: number;
  public readonly fastestDuration: number;
  public readonly slowestDuration: number;

  public readonly currentStreak: number;
  public readonly maxStreak: number;
  public readonly currentRank: string | null;

  public readonly highScoreExamName: string | null;
  public readonly fastestExamName: string | null;
  public readonly lastExamAt: Date| null;

  constructor(data: IUserStatisticsResponseDTO) {
    this.totalExams = data.totalExams;
    this.passedExams = data.passedExams;
    this.failedExams = data.failedExams;
    this.failedByCritical = data.failedByCritical;
    this.passRate = data.passRate;

    this.totalQuestionsAnswered = data.totalQuestionsAnswered;
    this.totalCorrectAnswers = data.totalCorrectAnswers;
    this.totalWrongAnswers = data.totalWrongAnswers;
    this.totalUnanswered = data.totalUnanswered;
    this.accuracyRate = data.accuracyRate;

    this.averageScore = data.averageScore;
    this.highScore = data.highScore;
    this.lowScore = data.lowScore;

    this.averageDuration = data.averageDuration;
    this.fastestDuration = data.fastestDuration;
    this.slowestDuration = data.slowestDuration;

    this.currentStreak = data.currentStreak;
    this.maxStreak = data.maxStreak;
    this.currentRank = data.currentRank;

    this.highScoreExamName = data.highScoreExamName;
    this.fastestExamName = data.fastestExamName;
    this.lastExamAt = data.lastExamAt;
  }
}