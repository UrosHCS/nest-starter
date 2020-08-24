import { INestApplication } from '@nestjs/common'

/**
 * The point of the context classes is to make it easier
 * to setup and teardown nest application and all of
 * the dependencies like the repositories.
 */
export abstract class TestContext {
  public app: INestApplication

  /**
   * This method should create and initialize a nest app instance.
   */
  abstract async createApp(): Promise<INestApplication>

  /**
   * Create the nest app. You must await this method
   * in order for this class to work properly.
   */
  async before() {
    this.app = await this.createApp()
  }

  /**
   * Helper to pass to afterEach in jest tests.
   */
  async after(): Promise<void> {
    await this.app.close()
  }
}
