import { Injectable } from '@nestjs/common'
import { Paginator } from 'src/shared/database/paginator'
import { Role, User } from 'src/user/user.entity'
import { UserRepository } from 'src/user/user.repository'
import { FindConditions } from 'typeorm'
import { UserFilter } from './user.filter.dto'

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  paginate(filter: UserFilter): Promise<Paginator<User>> {
    return this.repo.paginate({
      limit: filter.limit,
      page: filter.page,
      order: {
        [filter.order]: filter.direction.toUpperCase(),
      },
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
