import { Injectable } from '@nestjs/common'
import { Paginator } from 'src/shared/database/paginator'
import { Role, User } from 'src/users/user.entity'
import { UserRepository } from 'src/users/user.repository'
import { FindConditions } from 'typeorm'
import { UsersFilter } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

  index(filter: UsersFilter): Promise<Paginator<User>> {
    const orderColumn = filter.order ? filter.order.toLowerCase() : 'id'
    const direction = filter.direction ? filter.direction.toUpperCase() : 'ASC'

    return this.repo.paginate({
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

  findOne(options: FindConditions<User>): Promise<User | undefined> {
    return this.repo.findOne(options)
  }

  findOneOrFail(options: FindConditions<User>): Promise<User> {
    return this.repo.findOneOrFail(options)
  }

  create(attributes: { name?: string; email: string; role?: Role }) {
    return this.repo.save(attributes)
  }
}
