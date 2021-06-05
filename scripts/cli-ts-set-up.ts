import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from 'src/app/app.module'

export const app = NestFactory.create<NestExpressApplication>(AppModule)
