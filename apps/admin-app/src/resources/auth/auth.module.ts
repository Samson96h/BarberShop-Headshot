import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { Admin, AdminSchema } from '@app/common/database/scema/admin.schema';
import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { AuthController } from './auth.controller';
import { IJWTConfig } from '@app/common/models';
import { AuthService } from './auth.service';
import { AdminSeed } from '../../seed';
import { AdminEntity, AppointmentEntity, BarberServiceEntity, UserEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPostgreRepository } from './repositories/auth-postgre.repository';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity, AdminEntity]),
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
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, AdminSeed,
    {
      provide: "AUTH_REPOSITORY",
      useClass: AuthPostgreRepository
    }
  ],
  exports: [AdminAuthGuard, JwtModule]
})
export class AuthModule { }
