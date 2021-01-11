import { ModuleMetadata } from '@nestjs/common/interfaces'
import { AppModule } from 'src/app.module'
import { AuthService } from 'src/auth/auth.service'
import { User } from 'src/database/entities/user.entity'
import { EntityConstructor, factory } from 'src/database/factories/factory'
import { Request } from 'test/helpers/request'
import { Connection, ObjectType, Repository } from 'typeorm'
import { FastifyContext } from './fastify.context'

export class E2EContext extends FastifyContext {
  /**
   * Request wrapper object, uses supertest to make requests.
   */
  public req: Request

  constructor() {
    super()
    this.req = new Request()
  }

  protected moduleMetadata(): ModuleMetadata {
    // We will import the AppModule which basically means we initialize
    // the full nest application, not just specific modules.
    return {
      imports: [AppModule],
    }
  }

  async before() {
    // This is how we register all defined factories
    import('src/database/factories/definitions')
    await super.before()
    this.req.setServer(this.app.getHttpServer())
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

    this.req.setToken(token)

    return { user, token }
  }

  request() {
    return this.req
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
