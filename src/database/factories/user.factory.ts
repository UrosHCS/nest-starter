import { Role, User } from '../../users/user.entity'
import { define } from './factory'

define(User, async (faker, attributes) => {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    role: Role.client,
  }
})
