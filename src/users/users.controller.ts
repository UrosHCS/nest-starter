import { Controller, Get, Param, Query } from '@nestjs/common'
import { UserTransformer } from './transformers/user.transformer.js'
import { UsersTransformer } from './transformers/users.transformer.js'
import { UsersFilter } from './users.dto.js'
import { UsersService } from './users.service.js'

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  index(@Query() query: UsersFilter) {
    return this.service.index(query)
  }

  // Just an example of a collection transformer
  @Get('all')
  async all() {
    return UsersTransformer.make(await this.service.all())
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return UserTransformer.make(await this.service.findOneOrFail(id))
  }
}
