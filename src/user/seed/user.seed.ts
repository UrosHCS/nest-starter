import { Seed } from 'src/shared/seed/seed'
import { User } from 'src/user/user.entity'

export class UserSeed extends Seed<User> {
  protected entityClass = User

  protected filePath = __dirname + '/user.seed.csv'

  definition() {
    return {
      // Fields
      id: this.field('id'),
      name: this.field('name'),
      email: this.field('email'),
      role: this.field('role'),
    }
  }
}
