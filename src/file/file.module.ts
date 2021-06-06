import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import config from './config'
import { FileController } from './file.controller'

@Module({
  imports: [
    ConfigModule.forFeature(config),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('multer')!,
      inject: [ConfigService],
    }),
  ],

  controllers: [FileController],
})
export class AuthModule {}
