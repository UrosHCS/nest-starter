import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async makeToken(user: User): Promise<string> {
    const payload = { sub: user.id }
    const token = await this.jwtService.signAsync(payload)

    return token
  }
}
