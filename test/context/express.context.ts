import { INestApplication } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { appSetup } from 'src/app-setup'
import { TestContext } from './test.context'

export abstract class ExpressContext extends TestContext {
  /**
   * Return module metadata that you want in your nest app instance.
   */
  protected abstract moduleMetadata(): ModuleMetadata

  async createApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule(
      this.moduleMetadata(),
    ).compile()

    const app = moduleFixture.createNestApplication<NestExpressApplication>(new ExpressAdapter())

    // We do the same setup here and in main
    appSetup(app)

    await app.init()

    return app
  }
}
