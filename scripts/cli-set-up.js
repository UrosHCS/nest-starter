'use strict'

const fs = require('fs')

if (!fs.existsSync('./dist')) {
  throw "Can't find the 'dist' folder. You probably didn't build the app."
}

const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('../dist/src/app.module')
const { getMetadataArgsStorage } = require('typeorm')

module.exports = NestFactory.create(AppModule)
  .then(app => {
    // Keep track so we can print them for the user
    let registeredGlobalVariables = {}

    function registerGlobal(key, value, description = '?') {
      registeredGlobalVariables[key] = description
      global[key] = value
    }

    // The app implements INestApplicationContext interface
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

    // const { factory } = require('../dist/src/shared/factories/factory')

    // registerGlobal('factory', factory, 'function for making entities')

    registerGlobal('globals', registeredGlobalVariables, 'list of registered global variables')

    return registeredGlobalVariables
  })