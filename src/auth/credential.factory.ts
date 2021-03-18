import { hash } from 'bcrypt'
import { Attributes, BaseFactory } from 'src/shared/factories/factory'
import { UserFactory } from 'src/users/user.factory'
import { Credential, CredentialType } from './credential.entity'

export class CredentialFactory extends BaseFactory<Credential> {
  protected entityClass = Credential

  public async definition(): Promise<Attributes<Credential>> {
    return {
      type: CredentialType.password,
      value: await hash('password', 10),
      user: new UserFactory(),
    }
  }
}
