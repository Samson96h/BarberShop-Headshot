import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { SenderService } from 'libs/common/email/sender.service';
import { status } from '@app/common/database/enums';
import { IJWTConfig } from '@app/common/models';
import { ConfigService } from '@nestjs/config';
import { User } from '@app/common';


@Injectable()
export class AppService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User & Document>,
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

    let user: (User & Document) | null = null;

    if (email) {
      user = await this.userModel.findOne({ email }).exec();
    }

    if (!user) {
      const newUser: Partial<User> = {
        email: email ?? undefined,
        phone: undefined,
        firstName,
        lastName,
        role: status.CLIENT,
        isActive: true,
      };

      user = await this.userModel.create(newUser);

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
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.expiresIn,
    });

    return {
      message: 'User logged in via Google',
      user,
      token,
    };
  }
}