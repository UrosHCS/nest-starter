// Run this file with
// node --experimental-repl-await -r ./scripts/ard.js
// or
// npm run ard
'use strict'

require('./cli-set-up').then(registeredGlobalVariables => {
  
  console.log('\nWelcome to ard! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
})
.catch(reason => {
  console.log(reason)
})
