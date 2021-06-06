import { Attributes, BaseFactory } from 'src/shared/factories/factory'
import { File, FileStorage } from './file.entity'

export class FileFactory extends BaseFactory<File> {
  protected entityClass = File

  async definition(): Promise<Attributes<File>> {
    return {
      mimetype: 'image',
      size: 1000,
      path: 'public/files/images/image.jpg',
      storage: FileStorage.external,
    }
  }
}
