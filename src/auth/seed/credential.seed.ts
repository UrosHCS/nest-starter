import { Credential } from 'src/auth/credential.entity'
import { Seed } from 'src/shared/seed/seed'
import { User } from 'src/user/user.entity'

export class CredentialSeed extends Seed<Credential> {
  protected entityClass = Credential

  protected filePath = __dirname + '/credential.seed.csv'

  definition() {
    return [
      // Fields
      this.field('id'),
      this.field('value'),
      this.field('type'),
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
