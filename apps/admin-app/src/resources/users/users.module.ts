import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { Appointment, AppointmentSchema, BarberServices, BarberServiceSchema, User, UserSchema } from '@app/common';
import { UsersService } from './users.service';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema},
      { name: Appointment.name, schema: AppointmentSchema},
      { name: BarberServices.name, schema: BarberServiceSchema}
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
