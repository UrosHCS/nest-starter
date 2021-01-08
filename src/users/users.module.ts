import { Module } from '@nestjs/common'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
