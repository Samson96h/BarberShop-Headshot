import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import { UserEntity, SecretCode } from '@app/common/database/entities';
import { TokenService } from '@app/common/redis/token/auth.token';
import { RedisService } from '@app/common/redis/redis.service';
import { RedisModule } from '@app/common/redis/redis.module';
import { EmailModule } from 'libs/common/email/email.module';
import { AuthPostgreRepository } from './repositories';
import { AuthController } from './auth.controller';
import { IJWTConfig } from '@app/common/models';
import { AuthGuard } from '@app/common/guards';
import { AuthService } from './auth.service';


@Module({
  imports: [
    EmailModule,
    RedisModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const jwt = config.get<IJWTConfig>('JWT_CONFIG');
        if (!jwt) {
          throw new Error('JWT_CONFIG not found');
        }
        return {
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expiresIn },
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity, SecretCode, UserSecurityEntity]),
  ],
  providers: [
    TokenService,
    RedisService,
    AuthService,
    AuthGuard,
    {
      provide: 'AUTH_REPOSITORY',
      useClass: AuthPostgreRepository
    }
  ],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule, TokenService, AuthService],
})
export class AuthModule { }