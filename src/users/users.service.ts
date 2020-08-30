import { Injectable } from '@nestjs/common'
import { User } from 'src/database/entities/user.entity'
import { Paginator } from 'src/database/paginator'
import { UserRepository } from 'src/database/repositories/user.repository'
import { UsersFilter } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

  index(filter: UsersFilter): Promise<Paginator<User>> {
    const orderColumn = filter.order ? filter.order.toLowerCase() : 'id'
    const direction = filter.direction ? filter.direction.toUpperCase() : 'ASC'

    return this.repo.paginate({
      // select: safeUserFields,
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
