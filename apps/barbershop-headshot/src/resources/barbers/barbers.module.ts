import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BarberServiceEntity, MediaFilesEntity, UserEntity } from '@app/common/database/entities';
import { BarberPostgreRepository } from './repositories/barber-postgre.repository';
import { MediaPostgreService } from './services/media-postgre.service';
import { S3Module } from '@app/common/shared/s3/s3.module';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    S3Module,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, BarberServiceEntity, MediaFilesEntity]),
  ],
  controllers: [BarbersController],
  providers: [BarbersService, MediaPostgreService, BarberPostgreRepository,
    {
      provide: 'BARBER_REPOSITORY',
      useClass: BarberPostgreRepository
    }
  ],
})
export class BarbersModule { }
