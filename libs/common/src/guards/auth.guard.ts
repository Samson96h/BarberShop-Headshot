import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '@app/common/redis/token/auth.token';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) throw new UnauthorizedException('No token');

    const [, token] = auth.split(' ');

    let payload: any;

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_CONFIG').tempSecret,
      });

      if (!payload.temp) throw new Error();

      req.tempSession = {
        sessionId: payload.sub,
        phone: payload.phone,
      };

      return true;
    } catch { }

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_CONFIG').secret,
      });
    } catch {
      throw new UnauthorizedException('Token invalid');
    }

    const isRevoked = await this.tokenService.isTokenRevoked(
      payload.sub,
      payload.iat,
    );

    if (isRevoked) {
      throw new UnauthorizedException('Token revoked');
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      phone: payload.phone,
    };

    return true;
  }
}