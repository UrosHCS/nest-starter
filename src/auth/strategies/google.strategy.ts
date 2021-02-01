import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { ConfService } from 'src/conf/conf.service'

interface Profile {
  id: string
  displayName: string
  name: { familyName: string; givenName: string }
  emails: Array<{ value: string; verified: boolean }>
  photos: Array<{ value: string }>
  provider: 'google'
  // There's more properties that are less important
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(conf: ConfService) {
    super(conf.google)
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    // handle picture -> profile.photos[0].value

    // handle / verify accessToken -> accessToken

    // handle refreshToken -> refreshToken

    return {
      email: profile.emails[0].value,
      name: profile.displayName,
    }
  }
}
