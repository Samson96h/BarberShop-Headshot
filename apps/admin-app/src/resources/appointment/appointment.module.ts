import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserEntity, AppointmentEntity, BarberServiceEntity } from '@app/common/database/entities';
import { AppointmentPostgreRepositor } from './repositories/appointment-postgre.repository';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService,
    {
      provide: 'APPOINTMENT_REPOSITORY',
      useClass: AppointmentPostgreRepositor
    }
  ],
})
export class AppointmentModule { }
