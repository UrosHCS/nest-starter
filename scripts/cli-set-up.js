'use strict'

const fs = require('fs')

if (!fs.existsSync('./dist')) {
  throw "Can't find the 'dist' folder. You probably didn't build the app."
}

const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('../dist/src/app/app.module')

module.exports = NestFactory.create(AppModule)