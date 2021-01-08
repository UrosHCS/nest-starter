import * as faker from 'faker'
import { Factory } from 'typeorm-factory'
import { User } from '../entities/user.entity.js'

const UserFactory = new Factory(User)
    .sequence('name', (i) => faker.name.firstName() + ' ' + faker.name.lastName())