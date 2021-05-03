import { Controller, Delete, Get, Req } from '@nestjs/common'
import { Transformer } from 'src/shared/response/transformer'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/services/user.service'
import { UserTransformer } from 'src/user/transformers/user.transformer'
import { Auth } from '../auth.decorator'
import { LocalService } from '../services/local.service'
import { TokenService } from '../services/token.service'

@Controller()
export class AccountController {
  constructor(
    private readonly localService: LocalService,
    private readonly tokenService: TokenService,
    private readonly usersService: UserService,
  ) {}

  @Auth()
  @Get('me')
  async me(@Req() req: any) {
    return UserTransformer.make(await this.usersService.findOneOrFail({ id: req.user.id }))
  }

  @Auth()
  @Delete('me')
  async deleteAccount(@Req() req: any) {
    return await this.usersService.findOneOrFail({ id: req.user.id })
  }

  private async logInResponse(user: User) {
    return Transformer.make({
      token: await this.tokenService.makeToken(user),
      user: new UserTransformer(user).transform(),
    })
  }
}
