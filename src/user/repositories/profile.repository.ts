import { BaseRepository } from 'src/shared/database/base.repository'
import { EntityRepository } from 'typeorm'
import { Profile } from '../entities/profile.entity'

@EntityRepository(Profile)
export class ProfileRepository extends BaseRepository<Profile> {}
