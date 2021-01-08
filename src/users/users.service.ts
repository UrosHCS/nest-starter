import { Injectable } from '@nestjs/common'
import { safeUserFields, User } from '../database/entities/user.entity.js'
import { Paginator } from '../database/paginator.js'
import { UserRepository } from '../database/repositories/user.repository.js'
import { UsersFilter } from './users.dto.js'

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

  index(filter: UsersFilter): Promise<Paginator<User>> {
    const orderColumn = filter.order ? filter.order.toLowerCase() : 'id'
    const direction = filter.direction ? filter.direction.toUpperCase() : 'ASC'

    return this.repo.paginate({
      select: safeUserFields,
      limit: filter.limit,
      page: filter.page,
      order: {
        [orderColumn]: direction,
      },
    })
  }

  all() {
    return this.repo.find({
      relations: ['posts'],
    })
  }

  findOneOrFail(id: string | number): Promise<User> {
    return this.repo.findOneOrFail(id)
  }
}
