import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BarberServices, BarberServiceSchema, Appointment, AppointmentSchema, User, UserSchema } from '@app/common';
import { UserEntity, AppointmentEntity, BarberServiceEntity } from '@app/common/database/entities';
import { AppointmentPostgreRepositor } from './repositories/appointment-postgre.repository';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema }
    ]),
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
