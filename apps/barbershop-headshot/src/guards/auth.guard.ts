import {CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './models';
import { IJWTConfig } from 'src/models';


@Injectable()
export class AuthGuard implements CanActivate {
  private jwtConfig: IJWTConfig;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('You are not authorized, please login');
    }

    const [bearer, token] = authHeader.trim().split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    let payload: JwtPayload;
    
    try {
      payload = this.jwtService.verify(token, {
        secret: this.jwtConfig.secret,
      });
    } catch (err1) {
      try {
        payload = this.jwtService.verify(token, {
          secret: this.jwtConfig.tempSecret,
        });
      } catch (err2) {
        throw new UnauthorizedException('User is not authorized');
      }
    }

    request.user = {
      id: payload.sub,
      phone: payload.phone,
      temp: payload.temp ?? false,
    };

    return true;
  }
}
