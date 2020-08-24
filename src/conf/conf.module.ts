import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfService } from './conf.service'
import config from './config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  providers: [ConfService],
  exports: [ConfService],
})
export class ConfModule {}
