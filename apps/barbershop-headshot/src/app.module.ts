import { mongoConfig, jwtConfig, awsConfig, redisConfig, googleClientConfig } from '@app/common/config';
import { LoggerMiddleware } from '@app/common/middleware/logger.middleware';
import { RedisModule } from '@app/common/redis/redis.module';
import { validationSchema } from '@app/common/validation';

import { AppointmentModule } from './resources/appointment/appointment.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BarbersModule } from './resources/barbers/barbers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { smtpConfig } from '@app/common/config/smtp-config';
import { AuthModule } from './resources/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from '@app/common';
import { GoogleStrategy } from '@app/common/strategy/google.strategy';
import { EmailModule } from 'libs/common/email/email.module';


@Module({
  imports: [
    EmailModule,
    RedisModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [mongoConfig, jwtConfig, awsConfig, redisConfig, smtpConfig, googleClientConfig],
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
  providers: [AppService, GoogleStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(LoggerMiddleware).forRoutes('*'); }
}
