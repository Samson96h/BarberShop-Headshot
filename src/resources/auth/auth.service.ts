import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { AuthSession, AuthSessionDocument } from 'src/database/scema/auth-session.schema';
import { BarberOrClientDTO } from './dto/barber-or-client.dto';
import { User } from 'src/database/scema/users';
import { createRandomCode } from 'src/helpers';
import { IJWTConfig } from 'src/models';


@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;
  constructor(
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }

  async sendCode(dto: BarberOrClientDTO) {
    const code = createRandomCode().toString();

    const session = await this.authSessionModel.create({
      phone: dto.phone,
      status: dto.statusUser,
      code,
    });

    const tempToken = this.jwtService.sign(
      {
        sub: session._id.toString(),
        phone: dto.phone,
        temp: true,
      },
      {
        secret: this.jwtConfig.tempSecret,
        expiresIn: '5m',
      },
    );

    return {
      message: 'Verification code sent',
      tempToken,
      code,
    };
  }

  async verifyCode(phone: string, code: string) {
    const session = await this.authSessionModel.findOne({ phone, code });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.authSessionModel.updateOne(
      { _id: session._id },
      { verified: true },
    );

    let user = await this.userModel.findOne({ phone });

    if (!user) {
      user = await this.userModel.create({
        phone,
        role: session.status,
      });
    }

    const token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        phone: user.phone,
        role: user.role,
      },
      {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.expiresIn,
      },
    );

    return { token };
  }

}
