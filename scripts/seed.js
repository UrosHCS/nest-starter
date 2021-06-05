// TODO: make a cool seeding package instead of this
'use strict'

const { User } = require('../dist/src/user/entities/user.entity')
const { Credential } = require('../dist/src/auth/credential.entity')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')
const { UserSeed } = require('../dist/src/user/seed/user.seed')
const { CredentialSeed } = require('../dist/src/auth/seed/credential.seed')

require('./cli-set-up').then(async () => {

  await clearTables([
    User,
    Credential,
  ])

  console.log('Cleared all tables. Seeding...')

  await (new UserSeed().run())
  await (new CredentialSeed().run())

}).then(async () => {

  await getConnection().close()
  console.log('done')

}).catch(async reason => {

  await getConnection().close()
  console.log(reason)

})

async function clearTables(models) {
  for (const model of models) {
    await getRepository(model).delete({
      id: MoreThanOrEqual(1)
    })
    console.log('Cleared table ' + model.prototype.constructor.name)
  }
}