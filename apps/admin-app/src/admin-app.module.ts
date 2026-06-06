import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AdminEntity, AppointmentEntity, BarberServiceEntity, MediaFilesEntity, SecretCode, UserEntity } from '@app/common/database/entities';
import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import { AppointmentModule } from './resources/appointment/appointment.module';
import { LoggerMiddleware } from '@app/common/middleware/logger.middleware';
import { BarbersServicesModule } from './resources/barbers/barbers.module';
import { TranslationExceptionFilter } from '@app/common/exception_filter';
import { TranslationService } from '@app/common/i18n/TranslationService';
import { dbConfig, jwtConfig, redisConfig } from '@app/common/config';
import { TokenService } from '@app/common/redis/token/auth.token';
import { UsersModule } from './resources/users/users.module';
import { RedisModule } from '@app/common/redis/redis.module';
import { mongoConfig } from '@app/common/config/mongo.config';
import { AdminAppController } from './admin-app.controller';
import { smtpConfig } from '@app/common/config/smtp-config';
import { validationSchema } from '@app/common/validation';
import { AuthModule } from './resources/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminAppService } from './admin-app.service';
import { IDBConfig } from '@app/common/models';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/public/',
    }),
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: validationSchema,
      load: [mongoConfig, jwtConfig, redisConfig, smtpConfig, dbConfig],
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
    AuthModule,
    UsersModule,
    AppointmentModule,
    BarbersServicesModule
  ],
  controllers: [AdminAppController],
  providers: [AdminAppService, TokenService, TranslationExceptionFilter, TranslationService],
  exports: [TranslationExceptionFilter]
})

export class AdminAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(LoggerMiddleware).forRoutes('*'); }
}
