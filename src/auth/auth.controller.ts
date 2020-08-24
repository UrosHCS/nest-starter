import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common'
import { User } from 'src/database/entities/user.entity'
import { Transformer } from 'src/shared/response/transformer'
import { UserTransformer } from 'src/users/resources/user.transformer'
import { Auth } from './auth.decorator'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  me(@Req() req: any) {
    return UserTransformer.make(req.user)
  }

  private async logInResponse(user: User) {
    const token = await this.authService.makeToken(user)

    return Transformer.make({
      token,
      user: new UserTransformer(user).transform(),
    })
  }
}
