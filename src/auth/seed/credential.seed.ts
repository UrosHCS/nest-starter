import { Credential } from 'src/auth/credential.entity'
import { Seed } from 'src/shared/seed/seed'
import { User } from 'src/user/user.entity'

export class CredentialSeed extends Seed<Credential> {
  protected entityClass = Credential

  protected filePath = 'src/auth/seed/credential.seed.csv'

  definition() {
    return {
      // Fields
      id: this.field('id'),
      value: this.field('value'),
      type: this.field('type'),
      userId: this.field('userId', {
        databaseField: 'userId',
        relation: {
          entityClass: User,
          displayField: 'email',
          valueField: 'id',
        },
      }),
    }
  }
}
