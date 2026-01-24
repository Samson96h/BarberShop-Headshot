import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { BarberOrClientDTO } from './dto/barber-or-client.dto';
import { AuthSession, AuthSessionDocument, User } from '../../../../../libs/common/src/database';
import { createRandomCode } from '../../../../../libs/common/src/helpers';
import { IJWTConfig } from '../../../../../libs/common/src/models';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;
  constructor(
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSession>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }
  async sendCode(dto: BarberOrClientDTO) {
    const user = await this.userModel.findOne({ phone: dto.phone });

    if (user && user.role !== dto.statusUser) {
      throw new UnauthorizedException('User already registered with another role');
    }

    const code = createRandomCode().toString();

    await this.authSessionModel.updateMany(
      { phone: dto.phone, verified: false },
      { expiresAt: new Date() },
    );

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
      message: user ? 'Login code sent' : 'Registration code sent',
      tempToken,
      code
    };
  }

  
  async verifyCode(phone: string, code: string) {
    const session = await this.authSessionModel.findOne({
      phone,
      code,
      verified: false,
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    session.verified = true;
    await session.save();

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
