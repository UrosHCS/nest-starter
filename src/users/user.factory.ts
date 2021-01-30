import { BaseFactory } from 'src/shared/factories/factory'
import { Role, User } from './user.entity'

export class UserFactory extends BaseFactory<User> {
  protected entityClass = User

  public definition() {
    return {
      name: this.faker.internet.userName(),
      email: this.faker.internet.email(),
      role: Role.client,
    }
  }
}
