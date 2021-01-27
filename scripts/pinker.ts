import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from 'src/app.module'
import { getMetadataArgsStorage } from 'typeorm'

async function pinker(app: NestFastifyApplication) {
  let registeredGlobalVariables = {}

  function registerGlobal(key: string, value: any, description: string = '?') {
    registeredGlobalVariables[key] = description
    global[key] = value
  }

  registerGlobal('app', app, 'nest application instance')

  for (const repoMeta of getMetadataArgsStorage().entityRepositories) {
    const repoClass = repoMeta.target
    const entityClass = repoMeta.entity
    const repoVarName = repoClass.name.charAt(0).toLowerCase() + repoClass.name.slice(1)

    if (typeof entityClass !== 'function') {
      throw new Error('Entity class is not a constructor. Failing...')
    }

    registerGlobal(entityClass.name, entityClass, 'entity class')
    registerGlobal(repoVarName, app.get(repoClass), 'repository instance')
  }

  await import('../src/database/factories/definitions')

  const factory = (await import('../src/database/factories/factory')).factory

  registerGlobal('factory', factory, 'function for making entities')

  registerGlobal('globals', registeredGlobalVariables, 'list of registered global variables')

  console.log('\nWelcome to pinker! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
}

async function bootstrap(): Promise<NestFastifyApplication> {
  return await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
}

bootstrap()
  .then(pinker)
  .catch((reason) => {
    console.log(reason)
  })
