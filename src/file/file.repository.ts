import { BaseRepository } from 'src/shared/database/base.repository'
import { EntityRepository } from 'typeorm'
import { File } from './file.entity'

@EntityRepository(File)
export class FileRepository extends BaseRepository<File> {}
