import { BaseRepository } from 'src/shared/database/base.repository'
import { EntityRepository } from 'typeorm'
import { Credential } from './credential.entity'

@EntityRepository(Credential)
export class CredentialRepository extends BaseRepository<Credential> {}
