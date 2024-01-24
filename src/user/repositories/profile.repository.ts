import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/shared/database/base.repository'
import { DataSource } from 'typeorm'
import { Profile } from '../entities/profile.entity'

@Injectable()
export class ProfileRepository extends BaseRepository<Profile> {
  constructor(dataSource: DataSource) {
    super(Profile, dataSource)
  }
}
