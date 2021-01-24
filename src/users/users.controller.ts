import { Controller, Get, Param, Query } from '@nestjs/common'
import { UserTransformer } from './transformers/user.transformer'
import { UsersTransformer } from './transformers/users.transformer'
import { UsersFilter } from './users.dto'
import { UsersService } from './users.service'

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
  async get(@Param('id') id: number) {
    return UserTransformer.make(await this.service.findOneOrFail({ id }))
  }
}
