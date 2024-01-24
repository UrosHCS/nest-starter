import { BaseRepository } from 'src/shared/database/base.repository'
import { Credential } from './credential.entity'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class CredentialRepository extends BaseRepository<Credential> {
  constructor(dataSource: DataSource) {
    super(Credential, dataSource)
  }
}
