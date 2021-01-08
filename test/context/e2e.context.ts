import { ModuleMetadata } from '@nestjs/common/interfaces'
import * as request from 'supertest'
import { Connection, ObjectType, Repository } from 'typeorm'
import { AppModule } from '../../src/app.module.js'
import { AuthService } from '../../src/auth/auth.service.js'
import { User } from '../../src/database/entities/user.entity.js'
import { EntityConstructor, factory } from '../../src/database/factories/factory.js'
import { FastifyContext } from './fastify.context.js'

export class E2EContext extends FastifyContext {
  constructor() {
    super()
    // This is how we register all defined factories
    import('src/database/factories/definitions')
  }

  protected moduleMetadata(): ModuleMetadata {
    // We will import the AppModule which basically means we initialize
    // the full nest application, not just specific modules.
    return {
      imports: [AppModule],
    }
  }

  /**
   * Get the supertest request object
   */
  get request() {
    return request(this.app.getHttpServer())
  }

  /**
   * Typeorm connection to the database. The most low level db object.
   */
  getConnection(): Connection {
    return this.app.get(Connection)
  }

  repo<E>(entity: ObjectType<E>): Repository<E> {
    return this.getConnection().manager.getRepository<E>(entity)
  }

  async logIn(user?: User) {
    user = user || (await this.createUser())

    const token = await this.app.get(AuthService).makeToken(user)

    return { user, token }
  }

  factory<E>(entityClass: EntityConstructor<E>) {
    return factory(entityClass)
  }

  /**
   * Wrapper around factory seeding of a single entity
   */
  create<Entity>(entityClass: EntityConstructor<Entity>): Promise<Entity> {
    return this.factory(entityClass).create()
  }

  createUser(): Promise<User> {
    return this.create(User)
  }
}
