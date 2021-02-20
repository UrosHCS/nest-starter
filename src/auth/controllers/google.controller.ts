import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { ProfileBody } from 'src/auth/strategies/google.strategy'
import { Transformer } from 'src/shared/response/transformer'
import { UserTransformer } from 'src/users/transformers/user.transformer'
import { User } from 'src/users/user.entity'
import { GoogleService } from '../services/google.service'
import { TokenService } from '../services/token.service'

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  // This endpoint is not needed in the backend because this is
  // a REST API. The front end app should implement redirection
  // to google log in page and back.
  async googleAuth(@Req() req: Request) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  async logIn(@Req() req: Request) {
    const user = await this.googleService.findAndValidateUser(req.user as ProfileBody)

    return this.logInResponse(user)
  }

  @Get('register')
  @UseGuards(AuthGuard('google'))
  async register(@Req() req: Request) {
    const user = await this.googleService.registerUser(req.user as ProfileBody)

    return this.logInResponse(user)
  }

  private async logInResponse(user: User) {
    return Transformer.make({
      token: await this.tokenService.makeToken(user),
      user: new UserTransformer(user).transform(),
    })
  }
}
