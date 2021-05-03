import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/services/user.service'
import { CredentialType } from '../credential.entity'
import { OauthUser } from '../interfaces/oauth.user'
import { CredentialService } from './credential.service'

@Injectable()
export class GoogleService {
  constructor(
    private readonly usersService: UserService,
    private readonly credentialService: CredentialService,
  ) {}

  async findAndValidateUser(googleUser: OauthUser): Promise<User> {
    const user = await this.usersService.findOne({ email: googleUser.email })

    if (!user) {
      throw new UnauthorizedException('We could not find this email address.')
    }

    const credential = await this.credentialService.findOneOrFail(user.id)

    if (credential.type !== CredentialType.google) {
      throw new UnauthorizedException(
        `This account is not a google account, it is a ${credential.type} account.`,
      )
    }

    if (credential.value !== googleUser.id) {
      throw new UnauthorizedException(
        'Your google account does not match with the google account you are registered with, even though the email address is the same',
      )
    }

    return user
  }

  async registerUser(googleUser: OauthUser): Promise<User> {
    // TODO: check if email already exists

    const user = await this.usersService.create({
      email: googleUser.email,
      name: googleUser.name,
    })

    // TODO: handle picture

    this.credentialService.createGoogle({
      userId: user.id,
      value: googleUser.id,
    })

    return user
  }
}
