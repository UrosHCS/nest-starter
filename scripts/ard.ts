import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import * as repl from 'repl'
import { AppModule } from 'src/app/app.module'
import { getMetadataArgsStorage } from 'typeorm'

async function ard(app: NestExpressApplication) {
  const vars = {}

  const replServer = repl.start()

  replServer.on('exit', process.exit)

  function registerGlobal(key: string, value: unknown, description: string = '?') {
    vars[key] = description
    replServer.context[key] = value
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

  registerGlobal('vars', vars, 'list of registered variables')

  console.log('\nWelcome to ard! Here are all the registered variables:')
  console.log(vars)

  replServer.displayPrompt()
}

async function bootstrap(): Promise<NestExpressApplication> {
  return await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())
}

bootstrap()
  .then(ard)
  .catch((reason) => {
    console.log(reason)
  })
