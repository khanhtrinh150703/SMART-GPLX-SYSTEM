import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { redisClient } from '@/infrastructure/database/redis/redis.client';

export class RedisTokenRepository implements ITokenRepository {
  public async save(key: string, value: string, ttl: number): Promise<void> {
    await redisClient.setex(key, ttl, value);
  }

  public async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  public async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  public async deleteByPattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(...keys);
  }
}