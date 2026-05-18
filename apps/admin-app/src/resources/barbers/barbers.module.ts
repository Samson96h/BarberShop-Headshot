import { Module } from '@nestjs/common';

import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';
import { UserEntity, AppointmentEntity, BarberServiceEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersServicesModule {}
