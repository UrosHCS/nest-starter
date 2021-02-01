// TODO: make a cool seeding package instead of this
'use strict'

const { Role, User } = require('../dist/src/users/user.entity')
const { UserFactory } = require('../dist/src/users/user.factory')
const { Password } = require('../dist/src/auth/password.entity')
const { PasswordFactory } = require('../dist/src/auth/password.factory')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')

require('./cli-set-up').then(async () => {
  
  await getRepository(User).delete({
    id: MoreThanOrEqual(1)
  })

  let user = await new UserFactory.create({
    name: 'admin',
    email: 'admin@example.com',
    role: Role.admin,
  })

  await new PasswordFactory.create({ user })

  user = await new UserFactory.create({
    name: 'client',
    email: 'client@example.com',
    role: Role.client,
  })

  await new PasswordFactory.create({ user })

  user = await new UserFactory.create({
    name: 'john',
    email: 'john@example.com',
    role: Role.client,
  })

  await new PasswordFactory.create({ user })

}).then(() => {

  console.log('done')
  getConnection().close()

}).catch(reason => {

  console.log(reason)

})
