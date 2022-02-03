import { configure } from 'japa'

process.env.NODE_ENV = 'test'

async function beforeTests() {}

console.log('Starting configuration')
configure({
  files: ['test/**/*spec.ts'],
  before: [beforeTests],
})
console.log('End of configuration')
