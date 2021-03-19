import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'

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

export type ProfileBody = Profile['_json']

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super(configService.get('google'))
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): ProfileBody {
    // return accessToken also if you want to use it to make requests
    // to google API about the logged in user
    return profile._json
  }
}
