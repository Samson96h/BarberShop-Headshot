import { RedisService } from '@app/common/redis/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly redisService: RedisService) { }

  async blockUser(userId: string) {
    await this.redisService.set(
      `user:${userId}:revokedAt`,
      Date.now().toString(),
    );
  }

  async unblockUser(userId: string) {
    await this.redisService.unlock(`user:${userId}:revokedAt`);
  }

  async isTokenRevoked(userId: string, iat: number): Promise<boolean> {
    const revokedAt = await this.redisService.get(`user:${userId}:revokedAt`);

    if (!revokedAt) return false;

    return iat * 1000 < Number(revokedAt);
  }
}