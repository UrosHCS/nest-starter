import { NestExpressApplication } from '@nestjs/platform-express'
import * as repl from 'repl'
import { getMetadataArgsStorage } from 'typeorm'
import { app } from './cli-ts-set-up'

app
  .then((app: NestExpressApplication) => {
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
  })
  .catch((reason) => {
    console.log(reason)
  })
