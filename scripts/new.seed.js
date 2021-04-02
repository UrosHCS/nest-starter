// TODO: make a cool seeding package instead of this
'use strict'

const { User } = require('../dist/src/user/user.entity')
const { Credential } = require('../dist/src/auth/credential.entity')
const { getRepository, MoreThanOrEqual, getConnection } = require('typeorm')
const { UserSeed } = require('../dist/src/user/seed/user.seed')
const { CredentialSeed } = require('../dist/src/auth/seed/credential.seed')

require('./cli-set-up').then(async () => {
  await getRepository(User).delete({
    id: MoreThanOrEqual(1)
  })

  await getRepository(Credential).delete({
    id: MoreThanOrEqual(1)
  })

  new UserSeed().run()
  new CredentialSeed().run()

}).then(() => {

  getConnection().close()
  console.log('done')

}).catch(reason => {

  getConnection().close()
  console.log(reason)

})
