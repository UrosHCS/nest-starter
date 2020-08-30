// TODO: make a cool seeding package instead of this
'use strict'

const { Role, User } = require('../dist/src/database/entities/user.entity')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')
const { factory } = require('../dist/src/database/factories/factory')
const { Post } = require('../dist/src/database/entities/post.entity')

require('./cli-set-up').then(async () => {
  
  await getRepository(User).delete({
    id: MoreThanOrEqual(1)
  })

  const userFactory = factory(User)
  const postFactory = factory(Post)

  let user = await userFactory.create({
    name: 'admin',
    email: 'admin@example.com',
    role: Role.admin,
  })

  await postFactory.createMany(3, {user})

  user = await userFactory.create({
    name: 'client',
    email: 'client@example.com',
    role: Role.client,
  })

  await postFactory.createMany(3, {user})

  user = await userFactory.create({
    name: 'john',
    email: 'john@example.com',
    role: Role.client,
  })

  await postFactory.createMany(3, {user})

}).then(() => {

  console.log('done')
  getConnection().close()

}).catch(reason => {

  console.log(reason);

})
