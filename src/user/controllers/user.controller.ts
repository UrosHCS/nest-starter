import { Controller, Get, Param, Query } from '@nestjs/common'
import { UserFilter } from '../dtos/user.filter.dto'
import { UserService } from '../services/user.service'
import { UserTransformer } from '../transformers/user.transformer'

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
