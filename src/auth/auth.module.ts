import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import config from './config'
import { GoogleController } from './controllers/google.controller'
import { LocalController } from './controllers/local.controller'
import { CredentialRepository } from './credential.repository'
import { CredentialService } from './services/credential.service'
import { GoogleService } from './services/google.service'
import { LocalService } from './services/local.service'
import { TokenService } from './services/token.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    ConfigModule.forFeature(config),
    TypeOrmModule.forFeature([CredentialRepository]),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (conf: ConfigService) => conf.get('jwt')!,
      inject: [ConfigService],
    }),
  ],
  providers: [
    CredentialService,
    GoogleService,
    LocalService,
    TokenService,
    JwtStrategy,
    GoogleStrategy,
  ],
  controllers: [LocalController, GoogleController],
})
export class AuthModule {}
