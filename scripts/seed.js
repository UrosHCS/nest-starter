// TODO: make a cool seeding package instead of this
'use strict'

const { Role, User } = require('../dist/database/entities/user.entity')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')
const { factory } = require('../dist/database/factories/factory')

require('./cli-set-up').then(async () => {
  
  await getRepository(User).delete({
    id: MoreThanOrEqual(1)
  })

  const userFactory = factory(User)

  let user = await userFactory.create({
    name: 'admin',
    email: 'admin@example.com',
    role: Role.admin,
  })

  user = await userFactory.create({
    name: 'client',
    email: 'client@example.com',
    role: Role.client,
  })

  user = await userFactory.create({
    name: 'john',
    email: 'john@example.com',
    role: Role.client,
  })

}).then(() => {

  console.log('done')
  getConnection().close()

}).catch(reason => {

  console.log(reason);

})
