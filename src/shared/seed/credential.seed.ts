import { hash } from 'bcrypt'
import { Credential } from 'src/auth/credential.entity'
import { User } from 'src/user/user.entity'
import { Seed } from './seed'

export class CredentialSeed extends Seed<Credential> {
  protected entityClass = Credential

  definition() {
    return [
      // Fields
      this.field('value'),
      this.field('type', {
        resolver: async () => await hash('password', 10),
      }),
      this.field('user', {
        databaseField: 'userId',
        relation: {
          entityClass: User,
          displayField: 'email',
          valueField: 'id',
        },
      }),
    ]
  }
}
