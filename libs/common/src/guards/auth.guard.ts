import {CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './models';
import { IJWTConfig } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../database';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtConfig: IJWTConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.jwtConfig = this.configService.get('JWT_CONFIG') as IJWTConfig;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) throw new UnauthorizedException('No token');

    const [, token] = auth.split(' ');

    let payload: any;

    // 1️⃣ Пробуем temp token
    try {
      payload = this.jwtService.verify(token, {
        secret: this.jwtConfig.tempSecret,
      });

      if (!payload.temp) throw new Error();

      // TEMP TOKEN FLOW
      req.tempSession = {
        sessionId: payload.sub,
        phone: payload.phone,
      };

      return true;
    } catch {}

    // 2️⃣ Пробуем access token
    try {
      payload = this.jwtService.verify(token, {
        secret: this.jwtConfig.secret,
      });
    } catch {
      throw new UnauthorizedException('Token invalid');
    }

    // ACCESS TOKEN FLOW
    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token revoked');
    }

    req.user = {
      id: user._id,
      role: user.role,
      phone: user.phone,
    };

    return true;
  }
}
