import { hash } from 'bcrypt'
import { Attributes, BaseFactory } from 'src/shared/factories/factory'
import { Credential } from './credential.entity'

export class CredentialFactory extends BaseFactory<Credential> {
  protected entityClass = Credential

  public async definition(): Promise<Attributes<Credential>> {
    return {
      value: await hash('password', 10),
    }
  }
}
