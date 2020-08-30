'use strict'

const fs = require('fs')

if (!fs.existsSync('./dist')) {
  throw "Can't find the 'dist' folder. You probably didn't build the app."
}

const { NestFactory } = require('@nestjs/core')
const { FastifyAdapter } = require('@nestjs/platform-fastify')
const { AppModule } = require('../dist/src/app.module')

// We are reading this folder just for entity names. Since work dir
// the root dir, this path is fine.
const entitiesLocation = './src/database/entities'

module.exports = NestFactory.create(AppModule, new FastifyAdapter())
  .then(app => {
    // Keep track so we can print them for the user
    let registeredGlobalVariables = {}

    function registerGlobal(key, value, description = '?') {
      registeredGlobalVariables[key] = description
      global[key] = value
    }

    // The app implements INestApplicationContext interface
    registerGlobal('app', app, 'nest application instance')

    const entities = fs.readdirSync(entitiesLocation)

    for (const entityName of entities) {
      const name = entityName.split('.')[0]

      const entityInstanceName = name.replace(/-./g, match => match[1].toUpperCase())
      const entityClassName = entityInstanceName[0].toUpperCase() + entityInstanceName.substring(1)
      const repoName = `${entityClassName}Repository`

      let entityModule = require(`../dist/src/database/entities/${name}.entity`)

      registerGlobal(entityClassName, entityModule[entityClassName], 'entity class')

      // Here we will ignore error if a repo doesn't exist
      try {
        let repo = require(`../dist/src/database/repositories/${name}.repository`)
        registerGlobal(`${entityInstanceName}Repo`, app.get(repo[repoName]), 'repository instance')
      } catch (e) {
        // Do nothing
      }
    }

    require('../dist/src/database/factories/definitions')

    const factory = require('../dist/src/database/factories/factory').factory

    registerGlobal('factory', factory, 'function for making entities')

    registerGlobal('globals', registeredGlobalVariables, 'list of registered global variables')

    return registeredGlobalVariables
  })