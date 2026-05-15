import { BaseEntity } from "@/domain/seedwork/entity.base";
import {
  CreateUserStatisticsRequestProps,
  IUserStatisticsProps,
} from "./user-statistics.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { ISyncRankInputDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";

export class UserStatisticsEntity extends BaseEntity<IUserStatisticsProps> {
  private constructor(props: IUserStatisticsProps) {
    super(props);
    this.validate();
  }

  public static create(
    input: CreateUserStatisticsRequestProps,
  ): UserStatisticsEntity {
    const { userId } = input;

    // Toàn bộ logic "bản ghi trắng" nằm ở đây, Service không cần biết
    return new UserStatisticsEntity({
      userId,
      // Nhóm chỉ số bài thi
      totalExams: 0,
      passedExams: 0,
      failedExams: 0,
      failedByCritical: 0,

      // Nhóm câu hỏi
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalUnanswered: 0,

      // Nhóm hiệu suất
      averageScore: 0,
      averageDuration: 0,

      // Nhóm kỷ lục (Set mặc định để dễ so sánh ở updatePerformance)
      highScore: 0,
      highScoreExamId: null,
      highScoreExamName: null,

      lowScore: 0,
      lowScoreExamId: null,
      lowScoreExamName: null,

      fastestDuration: 999999,
      fastestExamId: null,
      fastestExamName: null,

      slowestDuration: 0,

      // Nhóm phong độ
      currentStreak: 0,
      maxStreak: 0,
      currentRank: null,

      // Metadata hệ thống
      lastExamAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  public static reconstitute(
    props: IUserStatisticsProps,
  ): UserStatisticsEntity {
    return new UserStatisticsEntity(props);
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  /**
   * @description Cập nhật toàn diện các chỉ số hiệu suất.
   * Xử lý logic Incremental Average, Records (High/Low/Fastest) và Streaks.
   */
  public updatePerformance(data: ISyncRankInputDTO): void {
    const oldTotal = this._props.totalExams;
    const newTotal = oldTotal + 1;

    // --- 1. TÍNH TOÁN STREAK (LÀM TRƯỚC KHI UPDATE lastExamAt) ---
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lastExamAt = this._props.lastExamAt
      ? new Date(this._props.lastExamAt)
      : null;
    if (lastExamAt) lastExamAt.setHours(0, 0, 0, 0);

    // Logic mới: Đảm bảo thoát khỏi số 0
    if (!lastExamAt || (this._props.currentStreak || 0) === 0) {
      // Thi lần đầu HOẶC đang bị kẹt ở số 0 -> Reset về 1
      this._props.currentStreak = 1;
    } else {
      const diffTime = today.getTime() - lastExamAt.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Thi vào ngày kế tiếp -> Tăng streak
        this._props.currentStreak += 1;
      } else if (diffDays > 1) {
        // Bỏ lỡ ít nhất 1 ngày -> Reset về 1
        this._props.currentStreak = 1;
      }
      // Nếu diffDays === 0 (thi cùng ngày) -> Giữ nguyên currentStreak đã có
    }

    // Cập nhật Max Streak
    this._props.maxStreak = Math.max(
      this._props.maxStreak || 0,
      this._props.currentStreak || 0,
    );

    // Cập nhật kỷ lục Streak
    if ((this._props.currentStreak || 0) > (this._props.maxStreak || 0)) {
      this._props.maxStreak = this._props.currentStreak;
    }

    // --- 2. CẬP NHẬT CÁC CHỈ SỐ CƠ BẢN ---
    this._props.totalExams = newTotal;
    if (data.isPassed) {
      this._props.passedExams = (this._props.passedExams || 0) + 1;
    } else {
      this._props.failedExams = (this._props.failedExams || 0) + 1;
    }

    // Tích lũy câu hỏi
    this._props.totalQuestionsAnswered += data.totalQuestions;
    this._props.totalCorrectAnswers += data.score;
    this._props.totalWrongAnswers += data.wrongAnswers;
    this._props.totalUnanswered += data.unanswered;

    // --- 3. ĐIỂM SỐ & THỜI GIAN TRUNG BÌNH ---
    const currentNormalizedScore = (data.score / data.totalQuestions) * 10;

    this._props.averageScore =
      ((this._props.averageScore || 0) * oldTotal + currentNormalizedScore) /
      newTotal;

    this._props.averageDuration =
      ((this._props.averageDuration || 0) * oldTotal + data.durationSeconds) /
      newTotal;

    // --- 4. CẬP NHẬT KỶ LỤC (RECORDS) ---
    if (newTotal === 1 || data.score > (this._props.highScore || 0)) {
      this._props.highScore = data.score;
      this._props.highScoreExamId = data.examId;
      this._props.highScoreExamName = data.examName;
    }

    if (newTotal === 1 || data.score < (this._props.lowScore || 999)) {
      this._props.lowScore = data.score;
      this._props.lowScoreExamId = data.examId;
      this._props.lowScoreExamName = data.examName;
    }

    if (
      !this._props.fastestDuration ||
      data.durationSeconds < this._props.fastestDuration
    ) {
      this._props.fastestDuration = data.durationSeconds;
      this._props.fastestExamId = data.examId;
      this._props.fastestExamName = data.examName;
    }

    if (
      !this._props.slowestDuration ||
      data.durationSeconds > this._props.slowestDuration
    ) {
      this._props.slowestDuration = data.durationSeconds;
    }

    // --- 5. METADATA (CẬP NHẬT CUỐI CÙNG) ---
    this._props.lastExamAt = now;
    this.touch();
    this.validate();
  }

  // --- GETTERS (Đầy đủ cho các trường mới) ---
  public get userId(): string {
    return this.props.userId;
  }
  public get totalExams(): number {
    return this.props.totalExams;
  }
  public get passedExams(): number {
    return this.props.passedExams;
  }
  public get failedExams(): number {
    return this.props.failedExams;
  }
  public get averageScore(): number {
    return this.props.averageScore;
  }
  public get averageDuration(): number {
    return this.props.averageDuration;
  }

  public get highScore(): number {
    return this.props.highScore;
  }
  public get highScoreInfo() {
    return {
      id: this.props.highScoreExamId,
      name: this.props.highScoreExamName,
    };
  }

  public get lowScore(): number {
    return this.props.lowScore;
  }

  public get fastestDuration(): number {
    return this.props.fastestDuration;
  }
  public get fastestExamInfo() {
    return { id: this.props.fastestExamId, name: this.props.fastestExamName };
  }

  public get currentStreak(): number {
    return this.props.currentStreak;
  }
  public get maxStreak(): number {
    return this.props.maxStreak;
  }
  public get lastExamAt(): Date {
    return this.props.lastExamAt;
  }

  private validate(): void {
    if (this.props.totalExams < 0) {
      throw new AppError(ErrorCode.USER_STATS.INVALID_TOTAL_EXAMS);
    }
    // Ông có thể thêm các validate khác như score không được âm...
  }
}
