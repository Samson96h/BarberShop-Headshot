import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserEntity, AppointmentEntity, BarberServiceEntity, AdminEntity } from '@app/common/database/entities';
import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import { UserPostgreRepository } from './repositories/user-postgre.repository';
import { TokenService } from '@app/common/redis/token/auth.token';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity, UserSecurityEntity, AdminEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService,
    {
      provide: "USER_REPOSITORY",
      useClass: UserPostgreRepository
    }
  ],
})
export class UsersModule { }
