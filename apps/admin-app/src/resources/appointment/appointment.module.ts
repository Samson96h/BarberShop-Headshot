import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { BarberServices, BarberServiceSchema, Appointment, AppointmentSchema, User, UserSchema } from '@app/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema}
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
