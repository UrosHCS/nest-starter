import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfService } from 'src/conf/conf.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(conf: ConfService) {
    super(conf.google)
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      fullProfile: profile,
      accessToken,
      refreshToken,
    }

    // handle picture -> photos[0].value

    // handle accessToken -> accessToken

    // handle refreshToken -> refreshToken

    done(undefined, user)
  }
}
