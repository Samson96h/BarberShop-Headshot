import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { BarberServices, BarberServiceSchema, UserImage, UserImageSchema, User, UserSchema } from '@app/common';
import { BarbersMongoRepository } from './repositories/barber-mongo.repository';
import { S3Module } from '@app/common/shared/s3/s3.module';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';
import { MediaMongoService } from './services/media-mongo.service';


@Module({
  imports: [
    S3Module,
    AuthModule,
    MongooseModule.forFeature([
      { name: BarberServices.name, schema: BarberServiceSchema },
      { name: UserImage.name, schema: UserImageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService,MediaMongoService,BarbersMongoRepository,
    {
      provide: 'BARBER_REPOSITORY',
      useClass: BarbersMongoRepository
    }
  ],
})
export class BarbersModule { }
