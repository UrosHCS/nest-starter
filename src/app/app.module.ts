import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { SharedModule } from 'src/shared/shared.module'
import { UsersModule } from 'src/users/users.module'
import { AppController } from './app.controller'
import config from './config'

@Module({
  imports: [
    // Set up configuration
    ConfigModule.forRoot({
      load: [config],
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    // Set up database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database')!,
      inject: [ConfigService],
    }),
    // Other modules
    SharedModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
