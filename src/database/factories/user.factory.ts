import { hash } from 'bcrypt'
import { Role, User } from '../entities/user.entity.js'
import { define } from './factory'

define(User, async (faker, attributes) => {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: await hash('password', 10),
    role: Role.client,
  }
})
