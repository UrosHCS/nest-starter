import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common'
import { User } from '../database/entities/user.entity.js'
import { Transformer } from '../shared/response/transformer.js'
import { UserTransformer } from '../users/transformers/user.transformer.js'
import { Auth } from './auth.decorator.js'
import { AuthService } from './auth.service.js'
import { LoginDto } from './dto/login.dto.js'
import { RegisterDto } from './dto/register.dto.js'

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
