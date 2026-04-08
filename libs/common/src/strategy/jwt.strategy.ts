import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_CONFIG').secret,
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) throw new UnauthorizedException('Invalid token payload');

    return {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  }
}