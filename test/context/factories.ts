import { CredentialFactory } from 'src/auth/credential.factory'
import { FileRepository } from 'src/file/file.repository'
import { ProfileFactory } from 'src/user/factories/profile.factory'
import { UserFactory } from 'src/user/factories/user.factory'
import { DataSource } from 'typeorm'

export class Factories {
  constructor(private readonly ds: DataSource) {}

  user() {
    return new UserFactory(this.ds)
  }

  profile() {
    return new ProfileFactory(this.ds)
  }

  credential() {
    return new CredentialFactory(this.ds)
  }

  file() {
    return new FileRepository(this.ds)
  }
}
