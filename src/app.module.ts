import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { ConfModule } from './conf/conf.module'
import { ConfService } from './conf/conf.service'
import { DatabaseModule } from './database/database.module'
import { SharedModule } from './shared/shared.module'
import { UsersModule } from './users/users.module'

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
