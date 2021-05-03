import { BaseFactory } from 'src/shared/factories/factory'
import { Role, User } from '../entities/user.entity'

export class UserFactory extends BaseFactory<User> {
  protected entityClass = User

  definition() {
    return {
      name: this.faker.internet.userName(),
      email: this.faker.internet.email(),
      role: Role.client,
    }
  }
}
