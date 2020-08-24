import { Post } from 'src/database/entities/post.entity'
import { User } from '../entities/user.entity'
import { define, factory } from './factory'

define(Post, async (faker, attributes) => {
  return {
    body: faker.lorem.sentence(),
    user: factory(User),
  }
})
