import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const config = configService.get('REDIS_CONFIG');

        const redis = new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          db: config.db,
        });

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}