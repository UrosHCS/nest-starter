import { Injectable } from '@nestjs/common'
import { Paginator } from 'src/shared/database/paginator'
import { Role, User } from 'src/user/entities/user.entity'
import { UserRepository } from 'src/user/repositories/user.repository'
import { UserFilter } from '../dtos/user.filter.dto'

interface FindOne {
  id?: number
  email?: string
}

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

  findOne(where: FindOne): Promise<User | undefined> {
    return this.repo.findOne(where)
  }

  findOneOrFail(where: FindOne): Promise<User> {
    return this.repo.findOneOrFail(where)
  }

  create(attributes: { name?: string; email: string; role?: Role }) {
    return this.repo.save(attributes)
  }

  delete(id: number) {
    return this.repo.delete(id)
  }
}
