import { Seed } from 'src/shared/seed/seed'
import { Profile } from 'src/user/entities/profile.entity'
import { User } from '../entities/user.entity'

export class ProfileSeed extends Seed<Profile> {
  protected entityClass = Profile

  protected filePath = 'src/user/seed/user.seed.csv'

  definition() {
    return [
      this.column('id'),
      this.column('gender'),
      this.column('phone'),
      this.column('image'),
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
