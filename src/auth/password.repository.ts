import { BaseRepository } from 'src/database/base.repository'
import { EntityRepository } from 'typeorm'
import { Password } from './password.entity'

@EntityRepository(Password)
export class PasswordRepository extends BaseRepository<Password> {}
