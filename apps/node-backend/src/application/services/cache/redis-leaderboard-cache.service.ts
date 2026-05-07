import { ILeaderboardCacheRepository } from '@/domain/interfaces/repositories/leaderboard/i-leaderboard-cache.repository';
import { Redis } from 'ioredis';

interface ICradle {
    redis: Redis;
}

export class RedisLeaderboardRepository implements ILeaderboardCacheRepository {
    private readonly _redis: Redis;
    private readonly _KEY_PREFIX = 'leaderboard:exam:';

    constructor({ redis }: ICradle) {
        this._redis = redis;
    }

    public async upsertScore(examId: string, userId: string, score: number, durationSeconds: number): Promise<void> {
        const key = `${this._KEY_PREFIX}${examId}`;
        const compositeScore = score + (1 - (durationSeconds / 86400));
        await this._redis.zadd(key, compositeScore, userId);
    }

    public async getTopUserIds(examId: string, limit: number): Promise<string[]> {
        const key = `${this._KEY_PREFIX}${examId}`;
        return await this._redis.zrevrange(key, 0, limit - 1);
    }

    public async getUserRankPosition(examId: string, userId: string): Promise<number | null> {
        const key = `${this._KEY_PREFIX}${examId}`;
        const rank = await this._redis.zrevrank(key, userId);
        return rank !== null ? rank + 1 : null;
    }

    public async clearLeaderboard(examId: string): Promise<void> {
        const key = `${this._KEY_PREFIX}${examId}`;
        await this._redis.del(key);
    }
}