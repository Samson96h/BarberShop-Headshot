import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { BarberServices, BarberServiceSchema, User, UserSchema } from '@app/common';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: User.name, schema: UserSchema}
    ]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersServicesModule {}
