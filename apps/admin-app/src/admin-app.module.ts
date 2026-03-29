import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppointmentModule } from './resources/appointment/appointment.module';
import { LoggerMiddleware } from '@app/common/middleware/logger.middleware';
import { BarbersServicesModule } from './resources/barbers/barbers.module';
import { TokenService } from '@app/common/redis/token/auth.token';
import { mongoConfig } from '@app/common/config/mongo.config';
import { UsersModule } from './resources/users/users.module';
import { RedisModule } from '@app/common/redis/redis.module';
import { jwtConfig, redisConfig } from '@app/common/config';
import { AdminAppController } from './admin-app.controller';
import { validationSchema } from '@app/common/validation';
import { AuthModule } from './resources/auth/auth.module';
import { AdminAppService } from './admin-app.service';


@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [mongoConfig, jwtConfig, redisConfig],
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
    AppointmentModule,
    BarbersServicesModule
  ],
  controllers: [AdminAppController],
  providers: [AdminAppService, TokenService]
})

export class AdminAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(LoggerMiddleware).forRoutes('*'); }
}
