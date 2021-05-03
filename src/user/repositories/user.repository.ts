import { BaseRepository } from 'src/shared/database/base.repository'
import { EntityRepository, Not } from 'typeorm'
import { Role, User } from '../entities/user.entity'

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  latestUsers(limit: number = 10): Promise<User[]> {
    return this.find({
      where: { role: Not(Role.admin) },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }
}
