import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Appointment, AppointmentSchema, User, UserSchema } from 'src/database';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema}
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
