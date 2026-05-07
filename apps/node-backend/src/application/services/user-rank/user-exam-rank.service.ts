import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";
import { UserExamRankEntity } from "@/domain/entities/user-rank/user-exam-rank.entity";
import { IUserExamRankRepository } from "@/domain/interfaces/repositories";
import { ILeaderboardCacheRepository } from "@/domain/interfaces/repositories/leaderboard/i-leaderboard-cache.repository";
import { IUserExamRankService } from "@/domain/interfaces/services";

/** * @interface IUserExamRankServiceCradle
 * @description Định nghĩa phụ thuộc cho UserExamRankService.
 * Cung cấp cả kho lưu trữ bền vững (SQL) và tốc độ cao (Redis).
 */
export interface IUserExamRankServiceCradle {
  userExamRankRepo: IUserExamRankRepository;
  leaderboardCacheRepo: ILeaderboardCacheRepository;
}

/** * @class UserExamRankService
 * @description Xử lý logic nghiệp vụ về xếp hạng và kỷ lục điểm số của người dùng.
 * @principle CQRS (Command) - Service này CHỈ chứa các thao tác làm thay đổi trạng thái (Write).
 */
export class UserExamRankService implements IUserExamRankService {
  private readonly _repo: IUserExamRankRepository;
  private readonly _cacheRepo: ILeaderboardCacheRepository;

  /** @description Khởi tạo service với các repository được tiêm từ container Awilix. */
  constructor({
    userExamRankRepo,
    leaderboardCacheRepo,
  }: IUserExamRankServiceCradle) {
    this._repo = userExamRankRepo;
    this._cacheRepo = leaderboardCacheRepo;
  }

  /**
   * @description Đồng bộ và cập nhật kỷ lục của người dùng sau mỗi lượt thi.
   * (Dịch: Synchronize and update user's record after each attempt).
   * @param request - DTO chứa dữ liệu kết quả lượt thi.
   * @returns {Promise<void>} - Trả về void (Đặc trưng của Command CQRS).
   */
  public async syncRank(request: SyncRankRequestDTO): Promise<void> {
    // 1. Lưu trữ dài hạn: Tìm kiếm kỷ lục hiện tại của người dùng trong SQL
    let rank = await this._repo.findByUserAndExam(
      request.userId,
      request.examId,
    );

    if (!rank) {
      // 2. Trường hợp chưa có kỷ lục: Tạo mới thực thể (Sử dụng Factory Method của DDD)
      rank = UserExamRankEntity.create({
        userId: request.userId,
        examId: request.examId,
        licenseCategoryId: request.licenseCategoryId,
        bestScore: request.score,
        fastestSeconds: request.durationSeconds,
        lastAttemptId: request.attemptId,
      });

      await this._repo.save(rank);
    } else {
      // 3. Trường hợp đã có kỷ lục: Sử dụng Rich Domain Logic để cập nhật nếu thành tích tốt hơn
      rank.updatePerformance(
        request.score,
        request.durationSeconds,
        request.attemptId,
      );

      await this._repo.update(rank);
    }

    // 4. Lưu trữ tốc độ cao: Đẩy dữ liệu vào Redis ngay lập tức (The Speed Layer)
    // Việc này đảm bảo Leaderboard luôn có dữ liệu mới nhất mà không cần quét lại SQL
    await this._cacheRepo.upsertScore(
      request.examId,
      request.userId,
      request.score,
      request.durationSeconds,
    );
  }
}
