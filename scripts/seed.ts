import { Credential } from 'src/auth/credential.entity'
import { CredentialSeed } from 'src/auth/seed/credential.seed'
import { User } from 'src/user/entities/user.entity'
import { UserSeed } from 'src/user/seed/user.seed'
import { getConnection, getRepository, MoreThanOrEqual } from 'typeorm'
import { app } from './cli-ts-set-up'

app
  .then(async () => {
    await clearTables([User, Credential])

    console.log('Cleared all tables. Seeding...')

    await new UserSeed().run()
    await new CredentialSeed().run()
  })
  .then(async () => {
    await getConnection().close()
    console.log('done')
  })
  .catch(async (reason) => {
    await getConnection().close()
    console.log(reason)
  })

async function clearTables(models: Function[]) {
  for (const model of models) {
    await getRepository(model).delete({
      id: MoreThanOrEqual(1),
    })
    console.log('Cleared table ' + model.prototype.constructor.name)
  }
}
