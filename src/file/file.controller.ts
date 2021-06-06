import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(private service: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.service.store({
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    })
  }
}
