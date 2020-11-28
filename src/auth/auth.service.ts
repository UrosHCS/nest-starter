import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
import { User } from 'src/database/entities/user.entity'
import { UserRepository } from 'src/database/repositories/user.repository'

@Injectable()
export class AuthService {
  constructor(private readonly users: UserRepository, private readonly jwtService: JwtService) {}

  async findAndValidateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findOne({ email })

    if (!user) {
      throw new UnauthorizedException('We could not find this email address.')
    }

    const passwordsMatch = await compare(password, user.password)

    if (!passwordsMatch) {
      throw new UnauthorizedException('Wrong password')
    }

    return user
  }

  async registerUser(email: string, password: string): Promise<User> {
    if (email === password) {
      throw new BadRequestException('Password cannot be same as email.')
    }

    if (this.forbiddenPasswords().includes(password)) {
      throw new BadRequestException(`Password ${password} can't be used because it is too common.`)
    }

    const user = await this.users.save({
      email,
      password: await this.hashPassword(password),
    })

    return user
  }

  async makeToken(user: User): Promise<string> {
    const payload = { sub: user.id }
    const token = await this.jwtService.signAsync(payload)

    return token
  }

  async hashPassword(password: string) {
    // Hashing rounds is hard coded to 10 for now. I don't think we need this
    // value anywhere else so I didn't bother getting it from config.
    return hash(password, 10)
  }

  findUserById(id: number) {
    return this.users.findOne({ id })
  }

  private forbiddenPasswords(): string[] {
    return [
      'password',
      'password1',
      'password12',
      'password123',
      'iloveyou',
      'qwertyui',
      'qwertyuio',
      'qwertyuiop',
      'qwerty123',
      'qwerty1234',
      '123qwerty',
      '1234qwerty',
      'q1w2e3r4',
      '1q2w3e4r',
      '11111111',
      '22222222',
      '33333333',
      '44444444',
      '55555555',
      '66666666',
      '77777777',
      '88888888',
      '99999999',
      '00000000',
      '123123123',
      '12345678',
      '123456789',
      '1234567890',
    ]
  }
}
