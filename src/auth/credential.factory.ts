import { hash } from 'bcrypt'
import { Attributes, BaseFactory } from 'src/shared/factories/factory'
import { UserFactory } from 'src/user/factories/user.factory'
import { Credential, CredentialType } from './credential.entity'

export class CredentialFactory extends BaseFactory<Credential> {
  protected entityClass = Credential

  async definition(): Promise<Attributes<Credential>> {
    return {
      type: CredentialType.local,
      value: await hash('password', 10),
      user: new UserFactory(),
    }
  }
}
