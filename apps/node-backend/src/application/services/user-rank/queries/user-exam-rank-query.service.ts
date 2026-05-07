import { IUserRankQueryService } from "@/domain/interfaces/services";
import { IUserExamRankRepository } from "@/domain/interfaces/repositories";
import { ILeaderboardCacheRepository } from "@/domain/interfaces/repositories/leaderboard/i-leaderboard-cache.repository";
import { IUserExamRankResponseDTO } from "@/application/dtos/response/user-rank/user-rank.response.dto";
import { UserExamRankMapper } from "@/infrastructure/database/mappers/use-rank";
import { UserExamRankEntity } from "@/domain/entities/user-rank/user-exam-rank.entity";

interface ICradle {
  userExamRankRepo: IUserExamRankRepository;
  leaderboardCacheRepo: ILeaderboardCacheRepository;
}

/**
 * @description Dịch vụ truy vấn bảng xếp hạng (Read-only).
 */
export class UserRankQueryService implements IUserRankQueryService {
  private readonly _sqlRepo: IUserExamRankRepository;
  private readonly _cacheRepo: ILeaderboardCacheRepository;

  constructor({ userExamRankRepo, leaderboardCacheRepo }: ICradle) {
    this._sqlRepo = userExamRankRepo;
    this._cacheRepo = leaderboardCacheRepo;
  }

  /** @description Lấy top bảng xếp hạng theo đề thi (Hybrid: Redis -> SQL) */
  public async getExamLeaderboard(
    examId: string,
    limit: number = 10,
  ): Promise<IUserExamRankResponseDTO[]> {
    // 1. Lấy IDs từ Redis Speed Layer
    const topUserIds = await this._cacheRepo.getTopUserIds(examId, limit);

    if (topUserIds?.length > 0) {
      // 2. Fetch chi tiết từ SQL theo IDs và Map sang DTO
      const entities = await this._sqlRepo.findByUserIdsAndExam(
        topUserIds,
        examId,
      );

      // Sort lại entities theo đúng thứ tự của topUserIds từ Redis
      const sortedEntities = topUserIds
        .map((id) => entities.find((e) => e.props.userId === id))
        .filter((e): e is UserExamRankEntity => !!e); 

      return UserExamRankMapper.toResponseList(sortedEntities);
    }

    // 3. Fallback: Truy vấn trực tiếp SQL nếu Redis trống
    const fallbackEntities = await this._sqlRepo.getLeaderboardByExam(
      examId,
      limit,
    );
    return UserExamRankMapper.toResponseList(fallbackEntities);
  }

  /** @description Lấy vị trí thứ hạng của User (Ưu tiên Redis) */
  public async getUserRankPosition(
    userId: string,
    examId: string,
  ): Promise<number> {
    const redisRank = await this._cacheRepo.getUserRankPosition(examId, userId);
    if (redisRank !== null) return redisRank;

    const userRank = await this._sqlRepo.findByUserAndExam(userId, examId);
    if (!userRank) return 0;

    return await this._sqlRepo.countBetterRanks(
      examId,
      userRank.props.bestScore,
      userRank.props.fastestSeconds,
    );
  }

  /** @description Lấy bảng xếp hạng theo hạng bằng lái */
  public async getCategoryLeaderboard(
    licenseCategoryId: string,
    limit: number = 10,
  ): Promise<IUserExamRankResponseDTO[]> {
    const entities = await this._sqlRepo.getLeaderboardByCategory(
      licenseCategoryId,
      limit,
    );
    return UserExamRankMapper.toResponseList(entities);
  }

  /** @description Lấy lịch sử kỷ lục cá nhân */
  public async getUserBestRecords(
    userId: string,
  ): Promise<IUserExamRankResponseDTO[]> {
    const entities = await this._sqlRepo.findAllByUser(userId);
    return UserExamRankMapper.toResponseList(entities);
  }

  /** @description Logic so sánh kỷ lục cá nhân */
  public async checkIfPersonalBest(
    userId: string,
    examId: string,
    currentScore: number,
    currentDuration: number,
  ): Promise<boolean> {
    const existing = await this._sqlRepo.findByUserAndExam(userId, examId);
    if (!existing) return true;

    const { bestScore, fastestSeconds } = existing.props;
    return (
      currentScore > bestScore ||
      (currentScore === bestScore && currentDuration < fastestSeconds)
    );
  }
}
