import { ILeaderboardCacheRepository } from "@/domain/interfaces/repositories/leaderboard/i-leaderboard-cache.repository";
import { Redis } from "ioredis";

/**
 * @interface ICradle
 * @description Định nghĩa các phụ thuộc cần thiết thông qua Awilix.
 */
interface ICradle {
  redisClient: Redis;
}

/**
 * @class RedisLeaderboardRepository
 * @description Triển khai lưu trữ bảng xếp hạng sử dụng Redis Sorted Set.
 */
export class RedisLeaderboardRepository implements ILeaderboardCacheRepository {
  private readonly _redis: Redis;

  /** @description Tiền tố khóa để quản lý không gian tên trong Redis. */
  private readonly _KEY_PREFIX = "leaderboard:exam:";

  constructor({ redisClient }: ICradle) {
    this._redis = redisClient;
  }

  public async upsertScore(
    examId: string,
    userId: string,
    score: number,
    durationSeconds: number,
  ): Promise<void> {
    const key = `${this._KEY_PREFIX}${examId}`;

    /** * @formula Composite Score (Điểm hỗn hợp)
     * Điểm = score + (1 - (thời_gian / 86400)).
     */
    const compositeScore = score + (1 - durationSeconds / 86400);

    await this._redis.zadd(key, compositeScore, userId);
  }

  public async getTopUserIds(examId: string, limit: number): Promise<string[]> {
    const key = `${this._KEY_PREFIX}${examId}`;
    return await this._redis.zrevrange(key, 0, limit - 1);
  }

  public async getUserRankPosition(
    examId: string,
    userId: string,
  ): Promise<number | null> {
    const key = `${this._KEY_PREFIX}${examId}`;
    const rankIndex = await this._redis.zrevrank(key, userId);

    return rankIndex !== null ? rankIndex + 1 : null;
  }

  public async clearLeaderboard(examId: string): Promise<void> {
    const key = `${this._KEY_PREFIX}${examId}`;
    await this._redis.del(key);
  }
}
