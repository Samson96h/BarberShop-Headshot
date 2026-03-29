import { mongoConfig, jwtConfig, awsConfig, redisConfig } from '@app/common/config';
import { LoggerMiddleware } from '@app/common/middleware/logger.middleware';
import { RedisModule } from '@app/common/redis/redis.module';
import { validationSchema } from '@app/common/validation';

import { AppointmentModule } from './resources/appointment/appointment.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BarbersModule } from './resources/barbers/barbers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './resources/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [mongoConfig, jwtConfig, awsConfig, redisConfig],
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
    AppointmentModule,
    BarbersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(LoggerMiddleware).forRoutes('*'); }
}
