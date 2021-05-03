import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from './config'
import { UserController } from './controllers/user.controller'
import { ProfileRepository } from './repositories/profile.repository'
import { UserRepository } from './repositories/user.repository'
import { UserService } from './services/user.service'

@Module({
  imports: [
    ConfigModule.forFeature(config),
    TypeOrmModule.forFeature([ProfileRepository, UserRepository]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
