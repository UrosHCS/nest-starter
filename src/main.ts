import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { appSetup } from './app-setup'
import { AppModule } from './app/app.module'
import { openApi } from './open.api'

// Enables passing the port and host thu env variables
const port = Number(process.env.NODE_PORT) || 3000
const host = process.env.NODE_HOST || 'localhost'

process.env.NODE_ENV = process.env.NODE_ENV || 'develop'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())

  // We do the same setup here and in tests
  appSetup(app)

  openApi(app)

  app.enableCors()

  await app.listen(port, host)
}
bootstrap().then(() => {
  console.log(`Listening on http://${host}:${port}
NODE_ENV: ${process.env.NODE_ENV}
If you are working with docker on dev environment
you can access the app on http://localhost:${port}`)
})
