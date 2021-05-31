import { INestApplication } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing'
import { appSetup } from 'src/app-setup'
import { TestContext } from './test.context'

export abstract class ExpressContext extends TestContext {
  moduleRef: TestingModule

  /**
   * Return module metadata that you want in your nest app instance.
   */
  protected abstract moduleMetadata(): ModuleMetadata

  createApp(): Promise<INestApplication> {
    return this.createAppFromBuilder(Test.createTestingModule(this.moduleMetadata()))
  }

  async createAppFromBuilder(builder: TestingModuleBuilder): Promise<INestApplication> {
    this.moduleRef = await builder.compile()

    const app = this.moduleRef.createNestApplication<NestExpressApplication>(new ExpressAdapter())

    // We do the same setup here and in main
    appSetup(app)

    await app.init()

    return app
  }
}
