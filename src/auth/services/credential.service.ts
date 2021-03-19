import { Injectable } from '@nestjs/common'
import { CredentialType } from '../credential.entity'
import { CredentialRepository } from '../credential.repository'

interface Fillable {
  userId: number
  value: string
}

@Injectable()
export class CredentialService {
  constructor(private readonly credentials: CredentialRepository) {}

  findOneOrFail(userId: number) {
    return this.credentials.findOneOrFail({ userId })
  }

  createPassword(attributes: Fillable) {
    return this.create(attributes, CredentialType.local)
  }

  createGoogle(attributes: Fillable) {
    return this.create(attributes, CredentialType.google)
  }

  createFacebook(attributes: Fillable) {
    return this.create(attributes, CredentialType.facebook)
  }

  private create(attributes: Fillable, type: CredentialType) {
    return this.credentials.save({ ...attributes, type })
  }
}
