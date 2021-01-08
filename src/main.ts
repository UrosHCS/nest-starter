import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { appSetup } from './app-setup.js'
import { AppModule } from './app.module.js'

// Enables passing the port and host thu env variables
const port = Number(process.env.NODE_PORT) || 3000
const host = process.env.NODE_HOST || 'localhost'

process.env.NODE_ENV = process.env.NODE_ENV || 'develop'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // This is where we tell nest to use fastify
    new FastifyAdapter(),
  )

  // We do the same setup here and in tests
  appSetup(app)

  
  
  await app.listen(port, host)
}
bootstrap().then(() => {
  console.log(`Listening on http://${host}:${port}
NODE_ENV: ${process.env.NODE_ENV}
If you are working with docker on dev environment
you can access the app on http://localhost:${port}`)
})
