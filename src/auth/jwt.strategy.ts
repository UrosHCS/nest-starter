import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfService } from '../conf/conf.service.js'
import { AuthService } from './auth.service.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, conf: ConfService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: conf.jwt.secret,
    })
  }

  async validate(payload: any) {
    // Passport will attach the return value as a property on the Request object.
    return this.authService.findUserById(payload.sub)
  }
}
