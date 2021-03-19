import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from 'src/app.module'
import { getMetadataArgsStorage } from 'typeorm'

async function ard(app: NestExpressApplication) {
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

  registerGlobal('globals', registeredGlobalVariables, 'list of registered global variables')

  console.log('\nWelcome to ard! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
}

async function bootstrap(): Promise<NestExpressApplication> {
  return await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())
}

bootstrap()
  .then(ard)
  .catch((reason) => {
    console.log(reason)
  })
