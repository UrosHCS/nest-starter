import { INestApplication } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { appSetup } from 'src/app-setup'
import { TestContext } from './test.context'

export abstract class ExpressContext extends TestContext {
  moduleRef: TestingModule

  /**
   * Return module metadata that you want in your nest app instance.
   */
  protected abstract moduleMetadata(): ModuleMetadata

  async createApp(): Promise<INestApplication> {
    this.moduleRef = await Test.createTestingModule(this.moduleMetadata()).compile()

    const app = this.moduleRef.createNestApplication<NestExpressApplication>(new ExpressAdapter())

    // We do the same setup here and in main
    appSetup(app)

    await app.init()

    return app
  }
}
