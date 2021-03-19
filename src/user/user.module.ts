import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from './config'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
  imports: [ConfigModule.forFeature(config), TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
