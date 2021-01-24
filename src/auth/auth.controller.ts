import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common'
import { Transformer } from 'src/shared/response/transformer'
import { UserTransformer } from 'src/users/transformers/user.transformer'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { Auth } from './auth.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async logIn(@Body() body: LoginDto) {
    const user = await this.authService.findAndValidateUser(body.email, body.password)

    return this.logInResponse(user)
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.registerUser(body.email, body.password)

    return this.logInResponse(user)
  }

  @Auth()
  @Get('me')
  async me(@Req() req: any) {
    return UserTransformer.make(await this.usersService.findOneOrFail({ id: req.user.id }))
  }

  private async logInResponse(user: User) {
    const token = await this.authService.makeToken(user)

    return Transformer.make({
      token,
      user: new UserTransformer(user).transform(),
    })
  }
}
