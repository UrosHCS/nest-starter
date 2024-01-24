import { BaseRepository } from 'src/shared/database/base.repository'
import { File } from './file.entity'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class FileRepository extends BaseRepository<File> {
  constructor(dataSource: DataSource) {
    super(File, dataSource)
  }
}
