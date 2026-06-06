import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import { MediaFilesEntity, UserEntity } from '@app/common/database/entities';
import { SenderService } from 'libs/common/email/sender.service';
import { userStatus } from '@app/common/database/enums';
import { IJWTConfig } from '@app/common/models';


@Injectable()
export class AppService {
  private jwtConfig: IJWTConfig;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserSecurityEntity)
    private readonly securityRepository: Repository<UserSecurityEntity>,
    @InjectRepository(MediaFilesEntity)
    private readonly mediaRepository: Repository<MediaFilesEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly senderService: SenderService,
  ) {
    const jwtConfig = this.configService.get<IJWTConfig>('JWT_CONFIG');
    if (!jwtConfig) {
      throw new Error('JWT_CONFIG not found in ConfigService');
    }
    this.jwtConfig = jwtConfig;
  }

  async oauthLogin(req) {
    if (!req.user) {
      return { message: 'No user from OAuth provider' };
    }

    const { email, firstName, lastName, picture } = req.user;

    let user: UserEntity | null = null;


    if (!user && email) {
      user = await this.userRepository.findOne({ where: { email }, relations: ['security', 'mediaFiles'] });
    }

    if (!user) {
      user = this.userRepository.create({
        firstName,
        lastName,
        email: email || null,
        status: userStatus.ACTIVE,
      });

      await this.userRepository.save(user);

      const security = this.securityRepository.create({ user });
      await this.securityRepository.save(security);
      user.security = security;

      if (user.email) {
        await this.senderService.sendEmail({
          to: user.email,
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          subject: 'Добро пожаловать!',
          template: 'welcome-email',
          context: {
            name: user.firstName || 'User',
          },
        });
      }

      if (picture) {
        const media = this.mediaRepository.create({
          path: picture,
          size: 0
        });

        await this.mediaRepository.save(media);

        user.mediaFiles = media;
        await this.userRepository.save(user);
      }
    }

    const payload = {
      sub: user.id,
      email,
      phone: user.phone,
      role: user.role
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      message: 'User logged in via OAuth provider',
      user,
      token
    };
  }
}