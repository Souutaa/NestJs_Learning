import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifiedCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '22977821670-37f4a3s4ttt5mftd62vg375bca9n5ktm.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'], //Là những gì bạn cần sau khi xác thực như là email, profile
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
