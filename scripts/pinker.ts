import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import * as fs from 'fs'
import { AppModule } from 'src/app.module'

async function pinker(app: NestFastifyApplication) {
  // Keep track so we can print them for the user
  let registeredGlobalVariables = {}

  function registerGlobal(key: string, value: any, description: string = '?') {
    registeredGlobalVariables[key] = description
    global[key] = value
  }

  // The app implements INestApplicationContext interface
  registerGlobal('app', app, 'nest application instance')

  const entities = fs.readdirSync('src/database/entities')

  for (const entityName of entities) {
    const name = entityName.split('.')[0]

    const entityInstanceName = name.replace(/-./g, (match) => match[1].toUpperCase())
    const entityClassName = entityInstanceName[0].toUpperCase() + entityInstanceName.substring(1)
    const repoName = `${entityClassName}Repository`

    let entityModule = await import(`../src/database/entities/${name}.entity`)

    registerGlobal(entityClassName, entityModule[entityClassName], 'entity class')

    // Here we will ignore error if a repo doesn't exist
    try {
      let repo = await import(`../src/database/repositories/${name}.repository`)
      registerGlobal(`${entityInstanceName}Repo`, app.get(repo[repoName]), 'repository instance')
    } catch (e) {
      // Do nothing
    }
  }

  // register factories
  await import('../src/database/factories/definitions')

  const factory = (await import('../src/database/factories/factory')).factory

  registerGlobal('factory', factory, 'function for making entities')

  registerGlobal('globals', registeredGlobalVariables, 'list of registered global variables')

  console.log('\nWelcome to pinker! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
}

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // This is where we tell nest to use fastify
    new FastifyAdapter(),
  )
  console.log('------------------------------------')
  return app
}

bootstrap()
  .then(pinker)
  .catch((reason) => {
    console.log(reason)
  })
