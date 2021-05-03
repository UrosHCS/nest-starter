import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/services/user.service'
import { CredentialType } from '../credential.entity'
import { CredentialService } from './credential.service'

@Injectable()
export class LocalService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
  ) {}

  async findAndValidateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email })

    if (!user) {
      throw new UnauthorizedException('We could not find this email address.')
    }

    const credential = await this.credentialService.findOneOrFail(user.id)

    if (credential.type !== CredentialType.local) {
      throw new UnauthorizedException(
        `This account is not a local account, it is a ${credential.type} account.`,
      )
    }

    const passwordsMatch = await this.comparePasswords(password, credential.value)

    if (!passwordsMatch) {
      throw new UnauthorizedException('Wrong password')
    }

    return user
  }

  async registerUser(email: string, password: string): Promise<User> {
    // Existence of a user with the same email is done in dto

    if (email === password) {
      throw new BadRequestException('Password cannot be same as email.')
    }

    if (!this.validatePassword(password)) {
      throw new BadRequestException(`Password ${password} can't be used because it is too common.`)
    }

    const user = await this.userService.create({
      email,
    })

    await this.credentialService.createPassword({
      userId: user.id,
      value: await this.hashPassword(password),
    })

    return user
  }

  private async comparePasswords(first: string, second: string) {
    return await compare(first, second)
  }

  private async hashPassword(password: string) {
    // Hashing rounds is hard coded to 10 for now. I don't think we need this
    // value anywhere else so I didn't bother getting it from config.
    return hash(password, 10)
  }

  findUserById(id: number) {
    return this.userService.findOne({ id })
  }

  private validatePassword(password: string): boolean {
    if (password.match(/^[0-9]+$/) !== null) {
      return false
    }

    if (password.startsWith('password') && password.length < 12) {
      return false
    }

    if (this.forbiddenPasswords().includes(password)) {
      return false
    }

    return true
  }

  private forbiddenPasswords(): string[] {
    return [
      'iloveyou',
      'qwertyui',
      'qwertyuio',
      'qwertyuiop',
      'qwerty123',
      'qwerty1234',
      'qwer1231',
      '1234qwer',
    ]
  }
}
