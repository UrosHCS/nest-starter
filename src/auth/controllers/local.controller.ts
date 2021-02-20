import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common'
import { Transformer } from 'src/shared/response/transformer'
import { UserTransformer } from 'src/users/transformers/user.transformer'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { Auth } from '../auth.decorator'
import { LoginDto } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'
import { LocalService } from '../services/local.service'
import { TokenService } from '../services/token.service'

@Controller()
export class LocalController {
  constructor(
    private readonly localService: LocalService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async logIn(@Body() body: LoginDto) {
    const user = await this.localService.findAndValidateUser(body.email, body.password)

    return this.logInResponse(user)
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.localService.registerUser(body.email, body.password)

    return this.logInResponse(user)
  }

  @Auth()
  @Get('me')
  async me(@Req() req: any) {
    return UserTransformer.make(await this.usersService.findOneOrFail({ id: req.user.id }))
  }

  private async logInResponse(user: User) {
    return Transformer.make({
      token: await this.tokenService.makeToken(user),
      user: new UserTransformer(user).transform(),
    })
  }
}
