import { INestApplication } from '@nestjs/common/interfaces'
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing'
import { appSetup } from 'src/app-setup'
import { AppModule } from 'src/app/app.module'
import { CredentialFactory } from 'src/auth/credential.factory'
import { TokenService } from 'src/auth/services/token.service'
import { User } from 'src/user/entities/user.entity'
import { UserFactory } from 'src/user/factories/user.factory'
import { Request } from 'test/helpers/request'
import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm'
import { Factories } from './factories'

export type OverrideClasses = (builder: TestingModuleBuilder) => void

export class E2EContext {
  public app: INestApplication

  /**
   * Request wrapper object, uses supertest to make requests.
   */
  public request: Request

  /**
   * Factories instance used to create specific factories.
   *
   * Example:
   *
   * ```ts
   * const user = await ctx.factories.user().create()
   * ```
   */
  public factories: Factories

  moduleRef: TestingModule

  constructor() {
    this.request = new Request()
  }

  async before(overrideClasses?: OverrideClasses) {
    this.app = await this.createApp(overrideClasses)
    this.factories = new Factories(this.getDataSource())
    this.requestSetUp()
  }

  requestSetUp() {
    this.request.setServer(this.app.getHttpServer())
  }

  async createApp(overrideClasses?: OverrideClasses): Promise<INestApplication> {
    const builder = Test.createTestingModule({
      // We will import the AppModule which basically means we initialize
      // the full nest application, not just specific modules.
      imports: [AppModule],
    })

    if (overrideClasses) {
      overrideClasses(builder)
    }

    this.moduleRef = await builder.compile()

    const app = this.moduleRef.createNestApplication<INestApplication>()

    // We do the same setup here and in main
    appSetup(app)

    await app.init()

    return app
  }

  /**
   * Typeorm connection to the database. The most low level db object.
   */
  getDataSource(): DataSource {
    return this.app.get(DataSource)
  }

  repo<E extends ObjectLiteral>(entity: ObjectType<E>): Repository<E> {
    return this.getDataSource().manager.getRepository<E>(entity)
  }

  async logIn(user?: User) {
    user = user || (await this.createUser())

    const token = await this.app.get(TokenService).makeToken(user)

    this.request.setHeader('Authorization', 'Bearer ' + token)

    return user
  }

  async createUser(): Promise<User> {
    const user = await new UserFactory(this.getDataSource()).create()

    await new CredentialFactory(this.getDataSource()).create({ user })

    return user
  }

  /**
   * Helper to pass to afterEach in jest tests.
   */
  async after(): Promise<void> {
    await this.app.close()
  }
}
