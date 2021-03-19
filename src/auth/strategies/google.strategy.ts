import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { OauthUser } from '../interfaces/oauth.user'

export interface Profile {
  id: string
  displayName: string
  name: { familyName: string; givenName: string }
  emails: Array<{ value: string; verified: boolean }>
  photos: Array<{ value: string }>
  provider: 'google'
  // raw response body string
  _raw: string
  // parsed response body
  _json: {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
    locale: string
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super(configService.get('google'))
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): OauthUser {
    // return accessToken also if you want to use it to make requests
    // to google API about the logged in user
    return {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
    }
  }
}
