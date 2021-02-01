import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfService } from 'src/conf/conf.service'
import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './controllers/auth.controller'
import { GoogleController } from './controllers/google.controller'
import { PasswordRepository } from './password.repository'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordRepository]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // ConfModule is global so no need to import it
      inject: [ConfService],
      useFactory: (conf: ConfService) => conf.jwt,
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController, GoogleController],
})
export class AuthModule {}
