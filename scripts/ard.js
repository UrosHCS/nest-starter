// Run this file with
// node --experimental-repl-await ./scripts/ard.js
// or
// npm run ard
'use strict'

const { getMetadataArgsStorage } = require('typeorm')
const repl = require('repl')

require('./cli-set-up').then(app => {
  // Keep track so we can print them for the user
  let vars = {}

  const replServer = repl.start()

  replServer.on('exit', process.exit)

  function registerGlobal(key, value, description = '?') {
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

  replServer.displayPrompt();
})
.catch(reason => {
  console.log(reason)
})
