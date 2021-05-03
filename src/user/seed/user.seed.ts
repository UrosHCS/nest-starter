import { Seed } from 'src/shared/seed/seed'
import { User } from 'src/user/entities/user.entity'

export class UserSeed extends Seed<User> {
  protected entityClass = User

  protected filePath = 'src/user/seed/user.seed.csv'

  definition() {
    return [
      // stop the prettier
      this.column('id'),
      this.column('name'),
      this.column('email'),
      this.column('role'),
    ]
  }
}
