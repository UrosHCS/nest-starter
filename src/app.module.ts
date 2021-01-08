import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller.js'
import { AuthModule } from './auth/auth.module.js'
import { ConfModule } from './conf/conf.module.js'
import { ConfService } from './conf/conf.service.js'
import { DatabaseModule } from './database/database.module.js'
import { SharedModule } from './shared/shared.module.js'
import { UsersModule } from './users/users.module.js'

@Module({
  imports: [
    AuthModule,
    ConfModule,
    DatabaseModule,
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      // this will automatically call createTypeOrmOptions method in the ConfService
      useExisting: ConfService,
    }),
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
