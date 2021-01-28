import { hash } from 'bcrypt'
import { Password } from 'src/auth/password.entity'
import { define } from '../shared/factories/factory'

define(Password, async (faker, attributes) => {
  return {
    // userId: must be passed in
    value: await hash('password', 10),
  }
})
