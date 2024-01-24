import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from './config'
import { FileController } from './file.controller'
import { File } from './file.entity'
import { FileRepository } from './file.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ConfigModule.forFeature(config),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('multer')!,
      inject: [ConfigService],
    }),
  ],

  controllers: [FileController],
  providers: [FileRepository],
})
export class AuthModule {}
