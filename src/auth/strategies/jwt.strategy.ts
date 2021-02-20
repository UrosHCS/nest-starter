import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfService } from 'src/conf/conf.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(conf: ConfService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: conf.jwt.secret,
    })
  }

  async validate(payload: any) {
    // Passport will attach the return value as the user property on the Request object.
    return {
      id: payload.sub,
    }
  }
}
