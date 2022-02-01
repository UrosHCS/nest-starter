import { configure } from 'japa'
import 'reflect-metadata'

process.env.NODE_ENV = 'test'

async function beforeTests() {}

configure({
  files: ['test/**/*spec.ts'],
  before: [beforeTests],
})
