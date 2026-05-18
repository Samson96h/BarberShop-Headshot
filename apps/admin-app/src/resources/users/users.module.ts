import { Module } from '@nestjs/common';

import { TokenService } from '@app/common/redis/token/auth.token';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UserEntity, AppointmentEntity, BarberServiceEntity, AdminEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity, UserSecurityEntity, AdminEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService],
})
export class UsersModule { }
