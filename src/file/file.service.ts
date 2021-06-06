import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileRepository } from './file.repository'

interface NewFileAttributes {
  mimetype: string
  size: number
  path: string
}

@Injectable()
export class FileService {
  constructor(private repo: FileRepository, private config: ConfigService) {}

  store(attributes: NewFileAttributes) {
    return this.repo.createAndSave({
      ...attributes,
      storage: this.config.get('storage.default'),
    })
  }
}
