import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserEntity, AppointmentEntity, BarberServiceEntity } from '@app/common/database/entities';
import { BarberPostgreRepository } from './repositories/barber-postgre.repository';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService,
    {
      provide: "BARBER_REPOSITORY",
      useClass: BarberPostgreRepository
    }
  ],
})
export class BarbersServicesModule { }
