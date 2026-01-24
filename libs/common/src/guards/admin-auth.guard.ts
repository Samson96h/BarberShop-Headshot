import {CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IJWTConfig } from '@app/common/models';
import { AdminJwtPayload } from './models';


@Injectable()
export class AdminAuthGuard implements CanActivate {
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

    let payload: AdminJwtPayload;
    
    try {
      payload = this.jwtService.verify(token, {
        secret: this.jwtConfig.adminSecret,
      });
    } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = {
      id: payload.sub,
      name: payload.name,
      temp: payload.temp ?? false,
    };

    return true;
  }
}
