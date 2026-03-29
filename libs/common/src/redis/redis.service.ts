import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) { }

  async set(key: string, value: string) {
    await this.redis.set(key, value, 'EX', 60 * 60 * 24);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async unlock(key: string) {
    return this.redis.del(key)
  }
}