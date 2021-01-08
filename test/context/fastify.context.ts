import { INestApplication } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import { appSetup } from '../../src/app-setup.js'
import { TestContext } from './test.context.js'

export abstract class FastifyContext extends TestContext {
  /**
   * Return module metadata that you want in your nest app instance.
   */
  protected abstract moduleMetadata(): ModuleMetadata

  async createApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule(
      this.moduleMetadata(),
    ).compile()

    const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    // We do the same setup here and in main
    appSetup(app)

    await app.init()

    // this line is needed when fastify adapter is used
    await app.getHttpAdapter().getInstance().ready()

    return app
  }
}
