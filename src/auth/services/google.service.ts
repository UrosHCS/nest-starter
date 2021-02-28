import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { CredentialType } from '../credential.entity'
import { ProfileBody } from '../strategies/google.strategy'
import { CredentialService } from './credential.service'

@Injectable()
export class GoogleService {
  constructor(
    private readonly usersService: UsersService,
    private readonly credentialService: CredentialService,
  ) {}

  async findAndValidateUser(body: ProfileBody): Promise<User> {
    const user = await this.usersService.findOne({ email: body.email })

    if (!user) {
      throw new UnauthorizedException('We could not find this email address.')
    }

    const credential = await this.credentialService.findOneOrFail(user.id)

    if (credential.type !== CredentialType.google) {
      throw new UnauthorizedException(
        `This account is not a google account, it is a ${credential.type} account.`,
      )
    }

    if (credential.value !== body.sub) {
      throw new UnauthorizedException(
        'Your google account does not match with the google account you are registered with, even though the email address is the same',
      )
    }

    return user
  }

  async registerUser(body: ProfileBody): Promise<User> {
    // TODO: check if email already exists

    const user = await this.usersService.create({
      email: body.email,
      name: body.name,
    })

    // TODO: handle picture

    this.credentialService.createGoogle({
      userId: user.id,
      value: body.sub,
    })

    return user
  }
}
