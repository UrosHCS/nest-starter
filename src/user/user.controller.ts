import { Controller, Get, Param, Query } from '@nestjs/common'
import { UserTransformer } from './transformers/user.transformer'
import { UserFilter } from './user.filter.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  index(@Query() query: UserFilter) {
    return this.service.paginate(query)
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return UserTransformer.make(await this.service.findOneOrFail({ id }))
  }
}
