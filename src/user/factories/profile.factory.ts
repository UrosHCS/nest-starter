import { BaseFactory } from 'src/shared/factories/factory'
import { Gender, Profile } from '../entities/profile.entity'

export class ProfileFactory extends BaseFactory<Profile> {
  protected entityClass = Profile

  definition() {
    return {
      name: this.faker.internet.userName(),
      email: this.faker.internet.email(),
      gender: Gender.male,
    }
  }
}
