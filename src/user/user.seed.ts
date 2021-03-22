import { User } from 'src/user/user.entity'
import { Seed } from '../shared/seed/seed'

export class UserSeed extends Seed<User> {
  protected entityClass = User

  definition() {
    return [
      // Fields
      this.field('name'),
      this.field('email'),
      this.field('role'),
    ]
  }
}
