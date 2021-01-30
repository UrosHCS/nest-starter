import { hash } from 'bcrypt'
import { BaseFactory } from 'src/shared/factories/factory'
import { Password } from './password.entity'

export class PasswordFactory extends BaseFactory<Password> {
  protected entityClass = Password

  public async definition() {
    return {
      value: await hash('password', 10),
    }
  }
}
