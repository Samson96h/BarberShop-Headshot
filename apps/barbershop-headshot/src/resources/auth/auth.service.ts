import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { BarberOrClientDTO } from './dto/barber-or-client.dto';
import { createRandomCode } from '@app/common/helpers';
import { User, AuthSession } from '@app/common';
import { IJWTConfig } from '@app/common/models';

@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSession>,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }


  async sendCode(dto: BarberOrClientDTO) {
    const user = await this.userModel.findOne({ phone: dto.phone });


    if (user?.isActive === false) {
      throw new ForbiddenException('Your account is permanently blocked.');
    }


    if (user?.blockedUntil && user.blockedUntil > new Date()) {
      const seconds = Math.ceil((user.blockedUntil.getTime() - Date.now()) / 1000);
      throw new ForbiddenException(`Too many attempts. Try again in ${seconds} seconds.`);
    }

    const code = createRandomCode().toString();

    await this.authSessionModel.updateMany(
      { phone: dto.phone, verified: false },
      { expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
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
      code,
    };
  }


  async verifyCode(phone: string, code: string) {
    let user = await this.userModel.findOne({ phone });

    if (user) {
      if (!user.isActive) {
        throw new ForbiddenException("Your account is permanently blocked.");
      }

      if (user.blockedUntil && user.blockedUntil > new Date()) {
        throw new ForbiddenException("Too many attempts. Try later.");
      }
    }

    const session = await this.authSessionModel.findOne({
      phone,
      code,
      verified: false,
    });


    if (!session || session.expiresAt < new Date()) {
      if (user) {
        if (user.temporaryBlockCount < 4) {
          user.temporaryBlockCount += 1;
          await user.save();
        } else {
          user.temporaryBlockCount = 0;
          user.permanentBlockCount += 1;
          user.blockedUntil = new Date(Date.now() + 30 * 1000);

          if (user.permanentBlockCount >= 3) {
            user.isActive = false;
          }

          await user.save();
        }
      }

      throw new UnauthorizedException("Invalid or expired code");
    }

    session.verified = true;
    await session.save();

    if (!user) {
      user = await this.userModel.create({
        phone,
        role: session.status,
      });
    }

    user.temporaryBlockCount = 0;
    user.blockedUntil = null;
    await user.save();

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