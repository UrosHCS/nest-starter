import { hash } from 'bcrypt'
import { Role, User } from 'src/database/entities/user.entity'
import { define } from './factory'

define(User, async (faker, attributes) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: await hash('password', 10),
    role: Role.client,
  }
})
