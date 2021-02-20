import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { PasswordRepository } from '../password.repository'
import { ProfileBody } from '../strategies/google.strategy'

@Injectable()
export class GoogleService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwords: PasswordRepository,
  ) {}

  async findAndValidateUser(body: ProfileBody): Promise<User> {
    throw new UnauthorizedException()
  }

  registerUser(body: ProfileBody): Promise<User> {
    throw new UnauthorizedException()
  }
}
