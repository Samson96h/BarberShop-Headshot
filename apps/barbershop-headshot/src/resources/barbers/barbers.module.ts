import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { BarberServices, BarberServiceSchema, User, UserImage, UserImageSchema, UserSchema } from '../../../../../libs/common/src/database';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';
import { S3Module } from '@app/common/shared/s3/s3.module';


@Module({
  imports: [
    S3Module,
    AuthModule,
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: UserImage.name, schema: UserImageSchema},
      { name: User.name, schema: UserSchema},
    ]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
