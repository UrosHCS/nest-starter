import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from './config'
import { UserRepository } from './user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [ConfigModule.forFeature(config), TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
