// TODO: make a cool seeding package instead of this
'use strict'

const { Role, User } = require('../dist/src/user/user.entity')
const { UserFactory } = require('../dist/src/user/user.factory')
const { CredentialFactory } = require('../dist/src/auth/credential.factory')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')
const { Credential } = require('../dist/src/auth/credential.entity')

require('./cli-set-up').then(async () => {
  
  clearTables([User, Credential])

  let user = await new UserFactory().create({
    name: 'admin',
    email: 'admin@example.com',
    role: Role.admin,
  })

  await new CredentialFactory().create({ user })

  user = await new UserFactory().create({
    name: 'client',
    email: 'client@example.com',
    role: Role.client,
  })

  await new CredentialFactory().create({ user })

  user = await new UserFactory().create({
    name: 'john',
    email: 'john@example.com',
    role: Role.client,
  })

  await new CredentialFactory().create({ user })

}).then(() => {

  getConnection().close()
  console.log('done')

}).catch(reason => {

  getConnection().close()
  console.log(reason)

})

function clearTables(models) {
  models.forEach((model) => {
    await getRepository(model).delete({
      id: MoreThanOrEqual(1)
    })
  })
}