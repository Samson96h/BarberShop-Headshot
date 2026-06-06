import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserEntity, AppointmentEntity, BarberServiceEntity } from '@app/common/database/entities';
import { AppointmentPostgreRepository } from './repositories/appointment-postgre.repository';
import { AppointmentController } from './appointment.controller';
import { EmailModule } from 'libs/common/email/email.module';
import { AppointmentService } from './appointment.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, AppointmentEntity, BarberServiceEntity]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService,
    {
      provide: 'APPOINTMENT_REPOSITORY',
      useClass: AppointmentPostgreRepository,
    }],
  exports: [AppointmentService]
})
export class AppointmentModule { }
