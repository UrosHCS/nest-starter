import { ModuleMetadata } from '@nestjs/common/interfaces'
import { AppModule } from 'src/app/app.module'
import { CredentialFactory } from 'src/auth/credential.factory'
import { TokenService } from 'src/auth/services/token.service'
import { User } from 'src/user/user.entity'
import { UserFactory } from 'src/user/user.factory'
import { Request } from 'test/helpers/request'
import { Connection, ObjectType, Repository } from 'typeorm'
import { ExpressContext } from './express.context'

export class E2EContext extends ExpressContext {
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

    const token = await this.app.get(TokenService).makeToken(user)

    this.req.setHeader('Authorization', 'Bearer ' + token)

    return user
  }

  request() {
    return this.req
  }

  async createUser(): Promise<User> {
    const user = await new UserFactory().create()

    await new CredentialFactory().create({ user })

    return user
  }
}
