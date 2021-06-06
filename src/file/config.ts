import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export default () => ({
  /**
   * middleware for handling multipart/form-data
   */
  multer: {
    dest: 'public/files',
  } as MulterOptions,
  /**
   * File storage config
   */
  storage: {
    // multer default storage is disk
    default: 'disk',
  },
})
