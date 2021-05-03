import { Credential } from 'src/auth/credential.entity'
import { Seed } from 'src/shared/seed/seed'
import { User } from 'src/user/entities/user.entity'

export class CredentialSeed extends Seed<Credential> {
  protected entityClass = Credential

  protected filePath = 'src/auth/seed/credential.seed.csv'

  definition() {
    return [
      this.column('id'),
      this.column('value'),
      this.column('type'),
      this.relation('user', {
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
