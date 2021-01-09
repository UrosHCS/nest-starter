import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from './repositories/user.repository'

// Make the database module global so we don't have to import it or
// typeorm in any other module. If you want you can remove the global
// decorator and import the database module where you need it, or
// import the TypeOrmModule for a certain feature directly.
@Global()
@Module({
  // Custom repositories are used so that we don't regret not using them
  // at some point later in the app development. Please include every
  // new repository here so you can inject it where it's needed.
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
    ]),
  ],
  // By exporting the TypeOrmModule here we make it possible to inject
  // any repository above into any module.
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
