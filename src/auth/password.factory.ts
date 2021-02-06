import { hash } from 'bcrypt'
import { Attributes, BaseFactory } from 'src/shared/factories/factory'
import { Password } from './password.entity'

export class PasswordFactory extends BaseFactory<Password> {
  protected entityClass = Password

  public async definition(): Promise<Attributes<Password>> {
    return {
      value: await hash('password', 10),
    }
  }
}
