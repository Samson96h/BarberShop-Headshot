import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BarberServices, BarberServiceSchema, AuthSession, AuthSessionSchema, Appointment, AppointmentSchema, User, UserSchema } from '@app/common';
import { TokenService } from '@app/common/redis/token/auth.token';
import { RedisService } from '@app/common/redis/redis.service';
import { RedisModule } from '@app/common/redis/redis.module';
import { AuthController } from './auth.controller';
import { IJWTConfig } from '@app/common/models';
import { AuthGuard } from '@app/common/guards';
import { AuthService } from './auth.service';


@Module({
  imports: [
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
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: AuthSession.name, schema: AuthSessionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    TokenService,
    RedisService,
    AuthService,
    AuthGuard
  ],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule, TokenService],
})
export class AuthModule { }