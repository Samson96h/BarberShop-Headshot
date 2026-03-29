import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Appointment, AppointmentSchema, BarberServices, BarberServiceSchema, User, UserSchema } from '@app/common';
import { TokenService } from '@app/common/redis/token/auth.token';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: BarberServices.name, schema: BarberServiceSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService],
})
export class UsersModule { }
