// Run this file with
// node --experimental-repl-await -r ./scripts/pinker.js
// or
// npm run pinker
'use strict'

require('./cli-set-up').then(registeredGlobalVariables => {
  
  console.log('\nWelcome to pinker! Here are all the registered global variables:')
  console.log(registeredGlobalVariables)
})
.catch(reason => {
  console.log(reason)
})
