import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const google = configService.get('GOOGLE_CLIENT_CONFIG');

    super({
      clientID: google.googleClientId,
      clientSecret: google.googleClientSecret,
      callbackURL: google.googleCallbackUrl,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails?.[0]?.value || null,
      firstName: name?.givenName || null,
      lastName: name?.familyName || null,
      picture: photos?.[0]?.value || null,
      accessToken,
      provider: 'google',
    };

    done(null, user);
  }
}