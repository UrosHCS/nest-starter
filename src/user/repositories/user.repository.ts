import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/shared/database/base.repository'
import { DataSource, Not } from 'typeorm'
import { Role, User } from '../entities/user.entity'

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource)
  }

  latestUsers(limit: number = 10): Promise<User[]> {
    return this.find({
      where: { role: Not(Role.admin) },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }
}
