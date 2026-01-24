import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Admin, AdminSchema } from '@app/common/database/scema/admin.schema';
import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { AuthController } from './auth.controller';
import { IJWTConfig } from '@app/common/models';
import { AuthService } from './auth.service';


@Module({
  imports: [
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
      { name: Admin.name, schema: AdminSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard],
  exports: [AdminAuthGuard, JwtModule]
})
export class AuthModule { }
