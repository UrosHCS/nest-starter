// Run this file with
// node --experimental-repl-await -r ./scripts/ard.js
// or
// npm run ard
'use strict'

const { getMetadataArgsStorage } = require('typeorm')

require('./cli-set-up').then(app => {
  // Keep track so we can print them for the user
  let registeredGlobalVariables = {}

  function registerGlobal(key, value, description = '?') {
    registeredGlobalVariables[key] = description
    global[key] = value
  }

  // The app implements INestApplicationContext interface
  registerGlobal('app', app, 'nest application instance')

  // const entityMetadata = 
  // registerGlobal('entityMetadata', entityMetadata, 'Entity metadata')

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

  console.log('\nWelcome to ard! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
})
.catch(reason => {
  console.log(reason)
})
