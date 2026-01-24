import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '@app/common/config';
import { Module } from '@nestjs/common';

import { AppointmentModule } from './resources/appointment/appointment.module';
import { mongoConfig } from '@app/common/config/mongo.config';
import { UsersModule } from './resources/users/users.module';
import { AdminAppController } from './admin-app.controller';
import { validationSchema } from '@app/common/validation';
import { AuthModule } from './resources/auth/auth.module';
import { AdminAppService } from './admin-app.service';
import { BarbersServicesModule } from './resources/barbers/barbers.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [mongoConfig, jwtConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongo = config.get('mongo');
        if (!mongo) {
          throw new Error('Mongo config not found');
        }
        return {
          uri: mongo.uri,
          dbName: mongo.dbName,
          retryAttempts: 5,
          retryDelay: 3000,
          serverSelectionTimeoutMS: 5000,
        };
      },
    }),
    AuthModule,
    UsersModule,
    BarbersServicesModule,
    AppointmentModule
  ],
  controllers: [AdminAppController],
  providers: [AdminAppService]
})
export class AdminAppModule { }
