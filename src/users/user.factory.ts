import { define } from 'src/shared/factories/factory'
import { Role, User } from './user.entity'

define(User, async (faker, attributes) => {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    role: Role.client,
  }
})
