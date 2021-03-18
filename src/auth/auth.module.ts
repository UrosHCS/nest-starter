import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfService } from 'src/conf/conf.service'
import { UsersModule } from 'src/users/users.module'
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
    TypeOrmModule.forFeature([CredentialRepository]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // ConfModule is global so no need to import it
      inject: [ConfService],
      useFactory: (conf: ConfService) => conf.jwt,
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
