import { mongoConfig, jwtConfig, awsConfig, redisConfig, googleClientConfig, dbConfig } from '@app/common/config';
import { LoggerMiddleware } from '@app/common/middleware/logger.middleware';
import { RedisModule } from '@app/common/redis/redis.module';
import { validationSchema } from '@app/common/validation';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, AdminEntity, BarberServiceEntity, AppointmentEntity, SecretCode, MediaFilesEntity } from '@app/common/database/entities';
import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import { AppointmentModule } from './resources/appointment/appointment.module';
import { TranslationExceptionFilter } from '@app/common/exception_filter';
import { TranslationService } from '@app/common/i18n/TranslationService';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GoogleStrategy } from '@app/common/strategy/google.strategy';
import { BarbersModule } from './resources/barbers/barbers.module';
import { EmailModule } from 'libs/common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { smtpConfig } from '@app/common/config/smtp-config';
import { AuthModule } from './resources/auth/auth.module';
import { AppController } from './app.controller';
import { IDBConfig } from '@app/common/models';
import { AppService } from './app.service';


@Module({
  imports: [
    EmailModule,
    RedisModule,
    TypeOrmModule.forFeature([UserEntity, MediaFilesEntity, UserSecurityEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [mongoConfig, jwtConfig, awsConfig, redisConfig, smtpConfig, googleClientConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig: IDBConfig = configService.get("DB_CONFIG") as IDBConfig;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [UserEntity, AdminEntity, BarberServiceEntity, AppointmentEntity, UserSecurityEntity, SecretCode, MediaFilesEntity],
          synchronize: true,
        }
      }
    }),
    AppointmentModule,
    BarbersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, TranslationExceptionFilter, TranslationService],
  exports: [TranslationExceptionFilter]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(LoggerMiddleware).forRoutes('*'); }
}
